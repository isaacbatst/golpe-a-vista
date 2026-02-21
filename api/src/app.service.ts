import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import crypto from 'crypto';
import { DeckRepository } from './deck.repository';
import { Either, left, right } from './domain/either';
import { Lobby } from './domain/lobby';
import { LegislativeStage } from './domain/stage/legislative-stage';
import { User } from './domain/user';
import { LobbyRepository } from './lobby.repository';
import { CPIStage } from 'src/domain/stage/cpi-stage';
import { InterceptionStage } from 'src/domain/stage/interception-stage';
import { SabotageCardStage } from 'src/domain/stage/sabotage-card-stage';
import { RadicalizationStage } from './domain/stage/radicalization-stage';
import { SABOTAGE_CARD_NAMES } from 'src/domain/sabotage-card/sabotage-card-names';
import { Mensalao } from 'src/domain/sabotage-card/mensalao';
import { ImpeachmentStage } from 'src/domain/stage/impeachment-stage';

@Injectable()
export class AppService {
  constructor(
    private readonly deckRepository: DeckRepository,
    private readonly lobbyRepository: LobbyRepository,
  ) {}

  async createLobby(body: {
    name: string;
  }): Promise<Either<Error, { lobby: Lobby; user: User }>> {
    let id = Math.random().toString(36).slice(2, 6).toUpperCase();
    while (await this.lobbyRepository.has(id)) {
      id = Math.random().toString(36).slice(2, 6).toUpperCase();
    }

    const [error, lobby] = Lobby.create({
      id: id,
    });
    if (!lobby) {
      return left(new InternalServerErrorException(error));
    }
    const lobbyMember = new User({
      id: crypto.randomUUID(),
      name: body.name,
      isHost: true,
    });
    const [addPlayerError] = lobby.addUser(lobbyMember);
    if (addPlayerError) {
      return left(new InternalServerErrorException(addPlayerError));
    }
    await this.lobbyRepository.save(lobby);
    return right({
      lobby: lobby,
      user: lobbyMember,
    });
  }

  async getLobby(id: string, userId: string): Promise<Either<Error, Lobby>> {
    const lobby = await this.lobbyRepository.get(id);
    if (!lobby) {
      return left(new NotFoundException());
    }

    if (!lobby.hasUser(userId)) {
      return left(new NotFoundException());
    }

    return right(lobby);
  }

  async joinLobby(
    id: string,
    body: { name: string; session?: { lobbyId: string; userId: string } },
  ): Promise<Either<Error, { lobby: Lobby; user: User }>> {
    const lobby = await this.lobbyRepository.get(id);
    if (!lobby) {
      return left(new NotFoundException('Lobby não encontrado'));
    }

    const userInLobby = lobby.users.find(
      (user) => user.id === body.session?.userId,
    );

    if (body.session && userInLobby) {
      return right({
        lobby: lobby,
        user: userInLobby,
      });
    }

    const newUser = new User({
      id: crypto.randomUUID(),
      name: body.name,
    });
    const [error] = lobby.addUser(newUser);
    if (error) {
      return left(new InternalServerErrorException(error));
    }
    await this.lobbyRepository.save(lobby);

    return right({
      lobby: lobby,
      user: newUser,
    });
  }

  async startGame(input: {
    lobbyId: string;
    issuerId: string;
  }): Promise<Either<Error, Lobby>> {
    const lobby = await this.lobbyRepository.get(input.lobbyId);
    if (!lobby) {
      return left(new NotFoundException('Lobby não encontrado'));
    }

    const sabotageCardsDeck = this.deckRepository.cloneSabotageCardsDeck();
    const lawsDeck = this.deckRepository.cloneLawsDeck();

    const [error] = lobby.startGame(input.issuerId, sabotageCardsDeck, lawsDeck);
    if (error) {
      return left(new InternalServerErrorException(error));
    }

    await this.lobbyRepository.save(lobby);
    return right(lobby);
  }

  async connectUser(
    lobbyId: string,
    userId: string,
    socketId: string,
  ): Promise<Either<Error, Lobby>> {
    const lobby = await this.lobbyRepository.get(lobbyId);
    if (!lobby) {
      return left(new NotFoundException('Lobby não encontrado'));
    }
    const [error] = lobby.connectUser(userId, socketId);
    if (error) {
      return left(new NotFoundException(error));
    }
    await this.lobbyRepository.save(lobby);
    return right(lobby);
  }

  async disconnectUser(
    userId: string,
    lobbyId: string,
  ): Promise<Either<Error, Lobby>> {
    const lobby = await this.lobbyRepository.get(lobbyId);
    if (!lobby) {
      return left(new NotFoundException('Lobby não encontrado'));
    }

    const [error] = lobby.disconnectUser(userId);

    if (error) {
      return left(new NotFoundException(error));
    }
    await this.lobbyRepository.save(lobby);
    return right(lobby);
  }

  async kickUser(input: {
    lobbyId: string;
    userId: string;
    issuerId: string;
  }): Promise<Either<Error, Lobby>> {
    const lobby = await this.lobbyRepository.get(input.lobbyId);
    if (!lobby) {
      return left(new NotFoundException('Lobby não encontrado'));
    }

    const [error] = lobby.removeUser(input.userId, input.issuerId);
    if (error) {
      return left(new NotFoundException(error));
    }

    await this.lobbyRepository.save(lobby);
    return right(lobby);
  }

  async resetLobby(
    id: string,
    issuerId: string,
  ): Promise<Either<Error, Lobby>> {
    const lobby = await this.lobbyRepository.get(id);
    if (!lobby) {
      return left(new NotFoundException('Lobby não encontrado'));
    }
    const [error] = lobby.reset(issuerId);
    if (error) {
      return left(new InternalServerErrorException(error));
    }
    await this.lobbyRepository.save(lobby);
    return right(lobby);
  }

  async legislativeStageDrawLaws(input: {
    lobbyId: string;
    issuerId: string;
  }): Promise<Either<Error, Lobby>> {
    const lobby = await this.lobbyRepository.get(input.lobbyId);
    if (!lobby) {
      return left(new NotFoundException('Lobby não encontrado'));
    }

    const stage = lobby.currentGame.currentRound.currentStage;
    if (stage instanceof LegislativeStage === false) {
      return left(
        new UnprocessableEntityException(
          'Não é possível sortear leis fora do estágio legislativo',
        ),
      );
    }

    const [error] = stage.drawLaws(
      lobby.currentGame.lawsDeck,
      input.issuerId,
      lobby.currentGame.presidentId,
    );

    if (error) {
      return left(new UnprocessableEntityException(error));
    }

    await this.lobbyRepository.save(lobby);
    return right(lobby);
  }

  async legislativeStageVetoLaw(input: {
    lobbyId: string;
    issuerId: string;
    vetoedLawId: string;
  }): Promise<Either<Error, Lobby>> {
    const lobby = await this.lobbyRepository.get(input.lobbyId);
    if (!lobby) {
      return left(new NotFoundException('Lobby não encontrado'));
    }

    const stage = lobby.currentGame.currentRound.currentStage;
    if (stage instanceof LegislativeStage === false) {
      return left(
        new UnprocessableEntityException(
          'Não é possível vetar leis fora do estágio legislativo',
        ),
      );
    }

    const drawnLawIndex = stage.drawnLaws.findIndex(
      (law) => law.id === input.vetoedLawId,
    );

    if (drawnLawIndex === -1) {
      return left(new NotFoundException('Lei não encontrada'));
    }

    const [error] = stage.vetoLaw(
      drawnLawIndex,
      input.issuerId,
      lobby.currentGame.presidentId,
    );

    if (error) {
      return left(new UnprocessableEntityException(error));
    }

    await this.lobbyRepository.save(lobby);
    return right(lobby);
  }

  async legislativeStageChooseLawForVoting(input: {
    lobbyId: string;
    issuerId: string;
    lawId: string;
  }): Promise<Either<Error, Lobby>> {
    const lobby = await this.lobbyRepository.get(input.lobbyId);
    if (!lobby) {
      return left(new NotFoundException('Lobby não encontrado'));
    }

    const stage = lobby.currentGame.currentRound.currentStage;
    if (stage instanceof LegislativeStage === false) {
      return left(
        new UnprocessableEntityException(
          'Não é possível escolher leis para votação fora do estágio legislativo',
        ),
      );
    }

    const drawnLawIndex = stage.drawnLaws.findIndex(
      (law) => law.id === input.lawId,
    );

    if (drawnLawIndex === -1) {
      return left(new NotFoundException('Lei não encontrada'));
    }

    const [error] = stage.chooseLawForVoting(
      drawnLawIndex,
      input.issuerId,
      lobby.currentGame.presidentId,
    );

    if (error) {
      return left(new UnprocessableEntityException(error));
    }

    const [startVotingError] = stage.startVoting(
      lobby.currentGame.votingPlayers.map((player) => player.id),
    );

    if (startVotingError) {
      return left(new InternalServerErrorException(startVotingError));
    }

    await this.lobbyRepository.save(lobby);
    return right(lobby);
  }

  async legislativeStageVoting(input: {
    lobbyId: string;
    issuerId: string;
    vote: boolean;
  }): Promise<Either<Error, Lobby>> {
    const lobby = await this.lobbyRepository.get(input.lobbyId);
    if (!lobby) {
      return left(new NotFoundException('Lobby não encontrado'));
    }
    const stage = lobby.currentGame.currentRound.currentStage;
    if (stage instanceof LegislativeStage === false) {
      return left(
        new UnprocessableEntityException(
          'Não é possível votar fora do estágio legislativo',
        ),
      );
    }
    const [error, allPlayersVoted] = stage.vote(input.issuerId, input.vote);
    if (error) {
      return left(new UnprocessableEntityException(error));
    }
    if (allPlayersVoted) {
      const [error] = stage.endVoting(
        lobby.currentGame.currentRound.mirroedVotes,
      );
      if (error) {
        return left(new UnprocessableEntityException(error));
      }
    }

    await this.lobbyRepository.save(lobby);
    return right(lobby);
  }

  async legislativeStageAdvanceStage(input: {
    lobbyId: string;
    issuerId: string;
  }): Promise<Either<Error, Lobby>> {
    const lobby = await this.lobbyRepository.get(input.lobbyId);
    if (!lobby) {
      return left(new NotFoundException('Lobby não encontrado'));
    }
    const stage = lobby.currentGame.currentRound.currentStage;
    if (stage instanceof LegislativeStage === false) {
      return left(
        new UnprocessableEntityException(
          'Não é possível avançar a ação fora do estágio legislativo',
        ),
      );
    }
    const [error] = this.advanceStageOrRound(lobby);
    if (error) {
      return left(new InternalServerErrorException(error));
    }
    await this.lobbyRepository.save(lobby);
    return right(lobby);
  }

  async cpiStageSelectRapporteur(input: {
    lobbyId: string;
    issuerId: string;
    rapporteurId: string;
  }): Promise<Either<Error, Lobby>> {
    const lobby = await this.lobbyRepository.get(input.lobbyId);
    if (!lobby) {
      return left(new NotFoundException('Lobby não encontrado'));
    }
    const stage = lobby.currentGame.currentRound.currentStage;
    if (stage instanceof CPIStage === false) {
      return left(
        new UnprocessableEntityException(
          'Não é possível selecionar um relator fora do estágio de CPI',
        ),
      );
    }
    const chosen = lobby.currentGame.getPlayerById(input.rapporteurId);
    if (!chosen) {
      return left(new NotFoundException('Relator não encontrado'));
    }
    if (!lobby.currentGame.nextPresident) {
      return left(new NotFoundException('Próximo presidente não encontrado'));
    }

    const [error] = stage.chooseNextRapporteur({
      chosen,
      currentPresident: lobby.currentGame.presidentId,
      currentRapporteur: lobby.currentGame.rapporteur,
      nextPresident: lobby.currentGame.nextPresident,
      issuerId: input.issuerId,
    });
    if (error) {
      return left(new InternalServerErrorException(error));
    }

    if (stage.isComplete) {
      const [error] = this.advanceStageOrRound(lobby);
      if (error) {
        return left(new InternalServerErrorException(error));
      }
    }

    await this.lobbyRepository.save(lobby);
    return right(lobby);
  }

  async cpiStageDeliverCPI(input: {
    lobbyId: string;
    issuerId: string;
  }): Promise<Either<Error, Lobby>> {
    const lobby = await this.lobbyRepository.get(input.lobbyId);
    if (!lobby) {
      return left(new NotFoundException('Lobby não encontrado'));
    }
    const stage = lobby.currentGame.currentRound.currentStage;
    if (stage instanceof CPIStage === false) {
      return left(
        new UnprocessableEntityException(
          'Não é possível receber a CPI fora do estágio de CPI',
        ),
      );
    }
    if (lobby.currentGame.rapporteur?.id !== input.issuerId) {
      return left(
        new UnprocessableEntityException(
          'Apenas o relator pode receber a CPI',
        ),
      );
    }

    const [error] = stage.deliverCPI(
      lobby.currentGame.lawsDeck,
      lobby.currentGame.rapporteur,
    );
    if (error) {
      return left(new InternalServerErrorException(error));
    }
    await this.lobbyRepository.save(lobby);
    return right(lobby);
  }

  async cpiStageAdvanceStage(input: {
    lobbyId: string;
    issuerId: string;
  }): Promise<Either<Error, Lobby>> {
    const lobby = await this.lobbyRepository.get(input.lobbyId);
    if (!lobby) {
      return left(new NotFoundException('Lobby não encontrado'));
    }
    const stage = lobby.currentGame.currentRound.currentStage;
    if (stage instanceof CPIStage === false) {
      return left(
        new UnprocessableEntityException(
          'Não é possível avançar a ação fora do estágio de CPI',
        ),
      );
    }
    const [error] = this.advanceStageOrRound(lobby);
    if (error) {
      return left(new InternalServerErrorException(error));
    }
    await this.lobbyRepository.save(lobby);
    return right(lobby);
  }

  async interceptionStageInterceptOrSkip(input: {
    lobbyId: string;
    issuerId: string;
    intercept: boolean;
  }): Promise<Either<Error, Lobby>> {
    const lobby = await this.lobbyRepository.get(input.lobbyId);
    if (!lobby) {
      return left(new NotFoundException('Lobby não encontrado'));
    }
    const stage = lobby.currentGame.currentRound.currentStage;
    if (stage instanceof InterceptionStage === false) {
      return left(
        new UnprocessableEntityException(
          'Não é possível interceptar ou pular fora do estágio de Interceptação',
        ),
      );
    }
    const [error] = stage.interceptOrSkip(input.intercept);
    if (error) {
      return left(new InternalServerErrorException(error));
    }
    await this.lobbyRepository.save(lobby);
    return right(lobby);
  }

  async interceptionStageAdvanceStage(input: {
    lobbyId: string;
    issuerId: string;
  }): Promise<Either<Error, Lobby>> {
    const lobby = await this.lobbyRepository.get(input.lobbyId);
    if (!lobby) {
      return left(new NotFoundException('Lobby não encontrado'));
    }
    const stage = lobby.currentGame.currentRound.currentStage;
    if (stage instanceof InterceptionStage === false) {
      return left(
        new UnprocessableEntityException(
          'Não é possível avançar a ação fora do estágio de Interceptação',
        ),
      );
    }
    const [error] = this.advanceStageOrRound(lobby);
    if (error) {
      return left(new InternalServerErrorException(error));
    }
    await this.lobbyRepository.save(lobby);
    return right(lobby);
  }

  async interceptionStageDrawCrises(input: {
    lobbyId: string;
    issuerId: string;
  }): Promise<Either<Error, Lobby>> {
    const lobby = await this.lobbyRepository.get(input.lobbyId);
    if (!lobby) {
      return left(new NotFoundException('Lobby não encontrado'));
    }
    const stage = lobby.currentGame.currentRound.currentStage;
    if (stage instanceof InterceptionStage === false) {
      return left(
        new UnprocessableEntityException(
          'Não é possível sacar cartas de sabotagem fora do estágio de Interceptação',
        ),
      );
    }
    const [error] = stage.drawSabotageCards(lobby.currentGame.sabotageCardsDeck);
    if (error) {
      return left(new InternalServerErrorException(error));
    }
    await this.lobbyRepository.save(lobby);
    return right(lobby);
  }

  async interceptionStageChooseSabotageCard(input: {
    lobbyId: string;
    issuerId: string;
    sabotageCardIndex: number;
  }): Promise<Either<Error, Lobby>> {
    const lobby = await this.lobbyRepository.get(input.lobbyId);
    if (!lobby) {
      return left(new NotFoundException('Lobby não encontrado'));
    }
    const stage = lobby.currentGame.currentRound.currentStage;
    if (stage instanceof InterceptionStage === false) {
      return left(
        new UnprocessableEntityException(
          'Não é possível escolher uma carta de sabotagem fora do estágio de Interceptação',
        ),
      );
    }
    const [error] = stage.chooseSabotageCard(input.sabotageCardIndex);
    if (error) {
      return left(new InternalServerErrorException(error));
    }
    await this.lobbyRepository.save(lobby);
    return right(lobby);
  }

  async sabotageCardStageApply(input: {
    lobbyId: string;
    issuerId: string;
  }): Promise<Either<Error, Lobby>> {
    const lobby = await this.lobbyRepository.get(input.lobbyId);
    if (!lobby) {
      return left(new NotFoundException('Lobby não encontrado'));
    }
    const stage = lobby.currentGame.currentRound.currentStage;
    if (stage instanceof SabotageCardStage === false) {
      return left(
        new UnprocessableEntityException(
          'Não é possível iniciar uma crise fora do estágio de Crise',
        ),
      );
    }

    if (!stage.sabotageCard && stage.isComplete) {
      const [error] = this.advanceStageOrRound(lobby);
      if (error) {
        return left(new InternalServerErrorException(error));
      }

      await this.lobbyRepository.save(lobby);
      return right(lobby);
    }

    const [error] = stage.applySabotageCard(lobby.currentGame.currentRound);
    if (error) {
      return left(new UnprocessableEntityException(error));
    }

    if (stage.isComplete) {
      const [error] = this.advanceStageOrRound(lobby);
      if (error) {
        return left(new InternalServerErrorException(error));
      }
    }

    await this.lobbyRepository.save(lobby);
    return right(lobby);
  }

  async sabotageCardStageMensalaoChoosePlayers(input: {
    lobbyId: string;
    issuerId: string;
    chosenPlayers: string[];
  }): Promise<Either<Error, Lobby>> {
    const lobby = await this.lobbyRepository.get(input.lobbyId);
    if (!lobby) {
      return left(new NotFoundException('Lobby não encontrado'));
    }
    const stage = lobby.currentGame.currentRound.currentStage;
    if (stage instanceof SabotageCardStage === false) {
      return left(
        new UnprocessableEntityException(
          'Não é possível escolher jogadores na crise Mensalão fora do estágio de Crise',
        ),
      );
    }
    if (stage.sabotageCardEffect?.sabotageCardName !== SABOTAGE_CARD_NAMES.MENSALAO) {
      return left(
        new UnprocessableEntityException(
          'Não é possível realizar a ação da crise Mensalão',
        ),
      );
    }
    const mensalao = stage.sabotageCardEffect as Mensalao;
    mensalao.setMirrorId(input.issuerId);
    mensalao.choosePlayers(input.chosenPlayers);
    await this.lobbyRepository.save(lobby);
    return right(lobby);
  }

  async radicalizationStageRadicalize(input: {
    lobbyId: string;
    issuerId: string;
    targetId: string;
  }): Promise<Either<Error, Lobby>> {
    const lobby = await this.lobbyRepository.get(input.lobbyId);
    if (!lobby) {
      return left(new NotFoundException('Lobby não encontrado'));
    }
    const stage = lobby.currentGame.currentRound.currentStage;
    if (stage instanceof RadicalizationStage === false) {
      return left(
        new UnprocessableEntityException(
          'Não é possível radicalizar fora do estágio de Radicalização',
        ),
      );
    }
    const target = lobby.currentGame.getPlayerById(input.targetId);
    if (!target) {
      return left(new NotFoundException('Jogador alvo não encontrado'));
    }
    const [error] = stage.radicalize(target);
    if (error) {
      return left(new InternalServerErrorException(error));
    }
    await this.lobbyRepository.save(lobby);
    return right(lobby);
  }

  async radicalizationStageAdvanceStage(input: {
    lobbyId: string;
    issuerId: string;
  }): Promise<Either<Error, Lobby>> {
    const lobby = await this.lobbyRepository.get(input.lobbyId);
    if (!lobby) {
      return left(new NotFoundException('Lobby não encontrado'));
    }
    const stage = lobby.currentGame.currentRound.currentStage;
    if (stage instanceof RadicalizationStage === false) {
      return left(
        new UnprocessableEntityException(
          'Não é possível avançar a ação fora do estágio de Radicalização',
        ),
      );
    }
    const [error] = this.advanceStageOrRound(lobby);
    if (error) {
      return left(new InternalServerErrorException(error));
    }
    await this.lobbyRepository.save(lobby);
    return right(lobby);
  }

  async impeachmentStageSelectTarget(input: {
    lobbyId: string;
    issuerId: string;
    targetId: string;
  }): Promise<Either<Error, Lobby>> {
    const lobby = await this.lobbyRepository.get(input.lobbyId);
    if (!lobby) {
      return left(new NotFoundException('Lobby não encontrado'));
    }
    const stage = lobby.currentGame.currentRound.currentStage;
    if (!stage) {
      return left(
        new UnprocessableEntityException('Não é possível cassar jogadores'),
      );
    }
    if (stage instanceof ImpeachmentStage === false) {
      return left(
        new UnprocessableEntityException(
          'Não é possível cassar jogadores fora do estágio de Impeachment',
        ),
      );
    }
    const target = lobby.currentGame.getPlayerById(input.targetId);
    if (!target) {
      return left(new NotFoundException('Jogador alvo não encontrado'));
    }
    const [chooseTargetError] = stage.chooseTarget(input.targetId, target.role);
    if (chooseTargetError) {
      return left(new UnprocessableEntityException(chooseTargetError));
    }
    if (stage.shouldSkipVoting) {
      const [error] = stage.impeach(target);
      if (error) {
        return left(new InternalServerErrorException(error));
      }
    } else {
      const [startVotingError] = stage.startVoting(
        lobby.currentGame.votingPlayers.map((player) => player.id),
      );
      if (startVotingError) {
        return left(new UnprocessableEntityException(startVotingError));
      }
    }
    await this.lobbyRepository.save(lobby);
    return right(lobby);
  }

  async impeachmentStageVoting(input: {
    lobbyId: string;
    issuerId: string;
    vote: boolean;
  }): Promise<Either<Error, Lobby>> {
    const lobby = await this.lobbyRepository.get(input.lobbyId);
    if (!lobby) {
      return left(new NotFoundException('Lobby não encontrado'));
    }
    const stage = lobby.currentGame.currentRound.currentStage;
    if (!stage) {
      return left(new UnprocessableEntityException('Não é possível votar'));
    }
    if (stage instanceof ImpeachmentStage === false) {
      return left(
        new UnprocessableEntityException(
          'Não é possível votar fora do impeachment',
        ),
      );
    }
    if (!stage.target) {
      return left(
        new UnprocessableEntityException('Não é possível votar sem um alvo'),
      );
    }
    const target = lobby.currentGame.getPlayerById(stage.target);
    if (!target) {
      return left(new NotFoundException('Alvo não encontrado'));
    }
    const [error] = stage.vote(input.issuerId, input.vote, target);
    if (error) {
      return left(new InternalServerErrorException(error));
    }
    await this.lobbyRepository.save(lobby);
    return right(lobby);
  }

  async impeachmentStageAdvanceStage(input: {
    lobbyId: string;
    issuerId: string;
  }): Promise<Either<Error, Lobby>> {
    const lobby = await this.lobbyRepository.get(input.lobbyId);
    if (!lobby) {
      return left(new NotFoundException('Lobby não encontrado'));
    }
    const stage = lobby.currentGame.currentRound.currentStage;
    if (!stage) {
      return left(new UnprocessableEntityException('Não é possível avançar'));
    }
    if (stage instanceof ImpeachmentStage === false) {
      return left(
        new UnprocessableEntityException(
          'Não é possível avançar fora do impeachment',
        ),
      );
    }
    const [error] = this.advanceStageOrRound(lobby);
    if (error) {
      return left(new InternalServerErrorException(error));
    }
    await this.lobbyRepository.save(lobby);
    return right(lobby);
  }

  private advanceStageOrRound(lobby: Lobby): Either<string, void> {
    const [error, nextStage] = lobby.currentGame.currentRound.nextStage();
    if (error) {
      return left(error);
    }
    if (!nextStage) {
      lobby.currentGame.nextRound();
    }
    return right();
  }
}
