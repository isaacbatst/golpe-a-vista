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
      return left(new NotFoundException());
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
      return left(new NotFoundException());
    }

    const crisesDeck = this.deckRepository.cloneCrisesDeck();
    const lawsDeck = this.deckRepository.cloneLawsDeck();

    const [error] = lobby.startGame(input.issuerId, crisesDeck, lawsDeck);
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
      return left(new NotFoundException());
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
      return left(new NotFoundException());
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
      return left(new NotFoundException());
    }

    const [error] = lobby.removeUser(input.userId, input.issuerId);
    if (error) {
      return left(new NotFoundException(error));
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
      return left(new NotFoundException());
    }

    const stage = lobby.currentGame.currentRound.currentStage;
    if (stage instanceof LegislativeStage === false) {
      return left(
        new UnprocessableEntityException(
          'Não é possível sortear leis fora do estágio legislativo',
        ),
      );
    }

    if (lobby.currentGame.president.id !== input.issuerId) {
      return left(
        new UnprocessableEntityException(
          'Apenas o presidente pode sortear leis',
        ),
      );
    }

    const [error] = stage.drawLaws(lobby.currentGame.lawsDeck);

    if (error) {
      return left(new UnprocessableEntityException(error));
    }

    await this.lobbyRepository.save(lobby);
    return right(lobby);
  }
}
