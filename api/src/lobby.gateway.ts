import { Inject } from '@nestjs/common';
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

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
  path: '/ws/socket',
})
export class LobbyGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly service: AppService,
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
}
