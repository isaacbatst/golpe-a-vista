import { Inject, UseFilters } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import session from 'express-session';
import { Server, Socket } from 'socket.io';
import { AppService } from './app.service';
import { LegislativeAction } from './domain/stage/legislative-stage';
import { StageType } from './domain/stage/stage';
import { WsExceptionFilter } from './filters/ws-exception.filter';
import { DossierAction } from 'src/domain/stage/dossier-stage';
import { SabotageAction } from 'src/domain/stage/sabotage-stage';
import { CrisisStageAction } from 'src/domain/stage/crisis-stage';
import { ConfigService } from '@nestjs/config';
import { RadicalizationAction } from './domain/stage/radicalization-stage';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
  path: '/ws/socket',
})
@UseFilters(new WsExceptionFilter())
export class LobbyGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly service: AppService,
    private readonly configService: ConfigService,
    @Inject('SESSION_MIDDLEWARE')
    private readonly sessionMiddleware: ReturnType<typeof session>,
  ) {}

  onApplicationBootstrap() {
    this.server.engine.use(this.sessionMiddleware);
  }

  handleConnection(client: Socket) {
    console.log('🟢 Cliente conectado:', client.id);
  }

  @SubscribeMessage('join')
  async handleJoinRoom(
    client: Socket,
    data: { lobbyId: string },
  ): Promise<void> {
    if (!client.request.session.userId) {
      return this.handleSocketError(client, 'Usuário não reconhecido');
    }

    const [error, lobby] = await this.service.connectUser(
      data.lobbyId,
      client.request.session.userId,
      client.id,
    );
    if (error) {
      return this.handleSocketError(client, error.message);
    }
    await client.join(data.lobbyId);
    this.server.to(data.lobbyId).emit('lobby:updated', lobby);
  }

  async handleDisconnect(client: Socket) {
    console.log('🔴 Cliente desconectado:', client.id);

    if (!client.request.session) {
      return;
    }

    const { userId, lobbyId } = client.request.session;
    if (!userId || !lobbyId) {
      return;
    }

    const [error, lobby] = await this.service.disconnectUser(userId, lobbyId);
    if (!lobby) {
      return this.handleSocketError(client, error.message);
    }
    this.server.to(lobby.id).emit('lobby:updated', lobby);
  }

  @SubscribeMessage('session:updated')
  setSession(client: Socket, data: { userId: string }) {
    if (this.configService.get('NODE_ENV') === 'production') {
      return this.handleSocketError(client, 'Operação não permitida');
    }
    client.request.session.reload((err) => {
      if (err) {
        return client.disconnect();
      }

      client.request.session.userId = data.userId;
      client.request.session.save(() => {
        if (err) {
          return client.disconnect();
        }

        client.emit('session:updated', { userId: data.userId });
      });
    });
  }

  @SubscribeMessage('kick')
  async kickUser(client: Socket, data: { lobbyId: string; userId: string }) {
    if (!client.request.session.userId) {
      return this.handleSocketError(client, 'Usuário não reconhecido');
    }
    const [error, lobby] = await this.service.kickUser({
      lobbyId: data.lobbyId,
      userId: data.userId,
      issuerId: client.request.session.userId,
    });
    if (error) {
      return this.handleSocketError(client, error.message);
    }
    const kickedUserSocket = Array.from(
      this.server.sockets.sockets.values(),
    ).find((s) => s.request.session?.userId === data.userId);
    if (kickedUserSocket) {
      kickedUserSocket.request.session.destroy(() => {
        kickedUserSocket.disconnect(true);
      });
    }

    this.server.to(data.lobbyId).emit('lobby:updated', lobby);
  }

  @SubscribeMessage(`reset`)
  async resetLobby(client: Socket, data: { lobbyId: string }) {
    if (!client.request.session.userId) {
      return this.handleSocketError(client, 'Usuário não reconhecido');
    }
    const [error, lobby] = await this.service.resetLobby(
      data.lobbyId,
      client.request.session.userId,
    );
    if (error) {
      return this.handleSocketError(client, error.message);
    }
    this.server.to(data.lobbyId).emit('lobby:updated', lobby);
  }

  @SubscribeMessage('start')
  async startGame(client: Socket, data: { lobbyId: string }) {
    if (!client.request.session.userId) {
      return this.handleSocketError(client, 'Usuário não reconhecido');
    }
    const [error, lobby] = await this.service.startGame({
      lobbyId: data.lobbyId,
      issuerId: client.request.session.userId,
    });
    if (error) {
      console.log(error);
      return this.handleSocketError(client, error.message);
    }
    this.server.to(data.lobbyId).emit('lobby:updated', lobby);
  }

  @SubscribeMessage(`${StageType.LEGISLATIVE}:${LegislativeAction.DRAW_LAWS}`)
  async drawLaws(client: Socket, data: { lobbyId: string }) {
    if (!client.request.session.userId) {
      return this.handleSocketError(client, 'Usuário não reconhecido');
    }
    const [error, lobby] = await this.service.legislativeStageDrawLaws({
      lobbyId: data.lobbyId,
      issuerId: client.request.session.userId,
    });
    if (error) {
      return this.handleSocketError(client, error.message);
    }
    this.server.to(data.lobbyId).emit('lobby:updated', lobby);
  }

  private handleSocketError(client: Socket, error: string) {
    console.error('❌ WebSocket Error:', error);
    client.emit('error', { message: error });
  }

  @SubscribeMessage(`${StageType.LEGISLATIVE}:${LegislativeAction.VETO_LAW}`)
  async vetoLaw(
    client: Socket,
    data: { lobbyId: string; vetoedLawId: string },
  ) {
    if (!client.request.session.userId) {
      return this.handleSocketError(client, 'Usuário não reconhecido');
    }
    const [error, lobby] = await this.service.legislativeStageVetoLaw({
      issuerId: client.request.session.userId,
      lobbyId: data.lobbyId,
      vetoedLawId: data.vetoedLawId,
    });
    if (error) {
      return this.handleSocketError(client, error.message);
    }
    this.server.to(data.lobbyId).emit('lobby:updated', lobby);
  }

  @SubscribeMessage(
    `${StageType.LEGISLATIVE}:${LegislativeAction.CHOOSE_LAW_FOR_VOTING}`,
  )
  async chooseLawForVoting(
    client: Socket,
    data: { lobbyId: string; lawId: string },
  ) {
    if (!client.request.session.userId) {
      return this.handleSocketError(client, 'Usuário não reconhecido');
    }
    const [error, lobby] =
      await this.service.legislativeStageChooseLawForVoting({
        issuerId: client.request.session.userId,
        lobbyId: data.lobbyId,
        lawId: data.lawId,
      });
    if (error) {
      return this.handleSocketError(client, error.message);
    }
    this.server.to(data.lobbyId).emit('lobby:updated', lobby);
  }

  @SubscribeMessage(`${StageType.LEGISLATIVE}:${LegislativeAction.VOTING}`)
  async voting(client: Socket, data: { lobbyId: string; vote: boolean }) {
    if (!client.request.session.userId) {
      return this.handleSocketError(client, 'Usuário não reconhecido');
    }
    const [error, lobby] = await this.service.legislativeStageVoting({
      issuerId: client.request.session.userId,
      lobbyId: data.lobbyId,
      vote: data.vote,
    });
    if (error) {
      return this.handleSocketError(client, error.message);
    }
    this.server.to(data.lobbyId).emit('lobby:updated', lobby);
  }

  @SubscribeMessage(
    `${StageType.LEGISLATIVE}:${LegislativeAction.ADVANCE_STAGE}`,
  )
  async advanceStage(client: Socket, data: { lobbyId: string }) {
    if (!client.request.session.userId) {
      return this.handleSocketError(client, 'Usuário não reconhecido');
    }
    const [error, lobby] = await this.service.legislativeStageAdvanceStage({
      issuerId: client.request.session.userId,
      lobbyId: data.lobbyId,
    });
    if (error) {
      return this.handleSocketError(client, error.message);
    }
    this.server.to(data.lobbyId).emit('lobby:updated', lobby);
  }

  @SubscribeMessage(
    `${StageType.REPORT_DOSSIER}:${DossierAction.SELECT_RAPPORTEUR}`,
  )
  async selectRapporteur(
    client: Socket,
    data: { lobbyId: string; rapporteurId: string },
  ) {
    if (!client.request.session.userId) {
      return this.handleSocketError(client, 'Usuário não reconhecido');
    }
    const [error, lobby] = await this.service.dossierStageSelectRapporteur({
      issuerId: client.request.session.userId,
      lobbyId: data.lobbyId,
      rapporteurId: data.rapporteurId,
    });
    if (error) {
      return this.handleSocketError(client, error.message);
    }
    this.server.to(data.lobbyId).emit('lobby:updated', lobby);
  }

  @SubscribeMessage(`${StageType.REPORT_DOSSIER}:${DossierAction.PASS_DOSSIER}`)
  async passDossier(client: Socket, data: { lobbyId: string }) {
    if (!client.request.session.userId) {
      return this.handleSocketError(client, 'Usuário não reconhecido');
    }
    const [error, lobby] = await this.service.dossierStagePassDossier({
      issuerId: client.request.session.userId,
      lobbyId: data.lobbyId,
    });
    if (error) {
      return this.handleSocketError(client, error.message);
    }
    this.server.to(data.lobbyId).emit('lobby:updated', lobby);
  }

  @SubscribeMessage(
    `${StageType.REPORT_DOSSIER}:${DossierAction.ADVANCE_STAGE}`,
  )
  async advanceDossierStage(client: Socket, data: { lobbyId: string }) {
    if (!client.request.session.userId) {
      return this.handleSocketError(client, 'Usuário não reconhecido');
    }
    const [error, lobby] = await this.service.dossierStageAdvanceStage({
      issuerId: client.request.session.userId,
      lobbyId: data.lobbyId,
    });
    if (error) {
      return this.handleSocketError(client, error.message);
    }
    this.server.to(data.lobbyId).emit('lobby:updated', lobby);
  }

  @SubscribeMessage(`${StageType.SABOTAGE}:${SabotageAction.SABOTAGE_OR_SKIP}`)
  async sabotageOrSkip(
    client: Socket,
    data: { lobbyId: string; sabotage: boolean },
  ) {
    if (!client.request.session.userId) {
      return this.handleSocketError(client, 'Usuário não reconhecido');
    }
    const [error, lobby] = await this.service.sabotageStageSabotageOrSkip({
      issuerId: client.request.session.userId,
      lobbyId: data.lobbyId,
      sabotage: data.sabotage,
    });
    if (error) {
      return this.handleSocketError(client, error.message);
    }
    this.server.to(data.lobbyId).emit('lobby:updated', lobby);
  }

  @SubscribeMessage(`${StageType.SABOTAGE}:${SabotageAction.ADVANCE_STAGE}`)
  async advanceSabotageStage(client: Socket, data: { lobbyId: string }) {
    if (!client.request.session.userId) {
      return this.handleSocketError(client, 'Usuário não reconhecido');
    }
    const [error, lobby] = await this.service.sabotageStageAdvanceStage({
      issuerId: client.request.session.userId,
      lobbyId: data.lobbyId,
    });
    if (error) {
      return this.handleSocketError(client, error.message);
    }
    this.server.to(data.lobbyId).emit('lobby:updated', lobby);
  }

  @SubscribeMessage(`${StageType.SABOTAGE}:${SabotageAction.DRAW_CRISIS}`)
  async drawCrises(client: Socket, data: { lobbyId: string }) {
    if (!client.request.session.userId) {
      return this.handleSocketError(client, 'Usuário não reconhecido');
    }
    const [error, lobby] = await this.service.sabotageDrawCrises({
      lobbyId: data.lobbyId,
      issuerId: client.request.session.userId,
    });
    if (error) {
      return this.handleSocketError(client, error.message);
    }
    this.server.to(data.lobbyId).emit('lobby:updated', lobby);
  }

  @SubscribeMessage(`${StageType.SABOTAGE}:${SabotageAction.CHOOSE_CRISIS}`)
  async chooseCrisis(
    client: Socket,
    data: { lobbyId: string; crisisIndex: number },
  ) {
    if (!client.request.session.userId) {
      return this.handleSocketError(client, 'Usuário não reconhecido');
    }
    const [error, lobby] = await this.service.sabotageChooseCrisis({
      lobbyId: data.lobbyId,
      issuerId: client.request.session.userId,
      crisisIndex: data.crisisIndex,
    });
    if (error) {
      return this.handleSocketError(client, error.message);
    }
    this.server.to(data.lobbyId).emit('lobby:updated', lobby);
  }

  @SubscribeMessage(`${StageType.CRISIS}:${CrisisStageAction.START_CRISIS}`)
  async startCrisis(client: Socket, data: { lobbyId: string }) {
    if (!client.request.session.userId) {
      return this.handleSocketError(client, 'Usuário não reconhecido');
    }
    const [error, lobby] = await this.service.crisisStageStartCrisis({
      lobbyId: data.lobbyId,
      issuerId: client.request.session.userId,
    });
    if (error) {
      return this.handleSocketError(client, error.message);
    }
    this.server.to(data.lobbyId).emit('lobby:updated', lobby);
  }

  @SubscribeMessage(
    `${StageType.RADICALIZATION}:${RadicalizationAction.RADICALIZE}`,
  )
  async radicalize(
    client: Socket,
    data: { lobbyId: string; targetId: string },
  ) {
    if (!client.request.session.userId) {
      return this.handleSocketError(client, 'Usuário não reconhecido');
    }
    const [error, lobby] = await this.service.radicalizationStageRadicalize({
      issuerId: client.request.session.userId,
      lobbyId: data.lobbyId,
      targetId: data.targetId,
    });
    if (error) {
      return this.handleSocketError(client, error.message);
    }
    this.server.to(data.lobbyId).emit('lobby:updated', lobby);
  }

  @SubscribeMessage(
    `${StageType.RADICALIZATION}:${RadicalizationAction.ADVANCE_STAGE}`,
  )
  async advanceRadicalizationStage(client: Socket, data: { lobbyId: string }) {
    if (!client.request.session.userId) {
      return this.handleSocketError(client, 'Usuário não reconhecido');
    }
    const [error, lobby] = await this.service.radicalizationStageAdvanceStage({
      issuerId: client.request.session.userId,
      lobbyId: data.lobbyId,
    });
    if (error) {
      return this.handleSocketError(client, error.message);
    }
    this.server.to(data.lobbyId).emit('lobby:updated', lobby);
  }
}
