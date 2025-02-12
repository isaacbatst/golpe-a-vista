import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import crypto from 'crypto';
import { AppRepository } from './app.repository';
import { Lobby } from './domain/lobby';
import { User } from './domain/user';
import { Either, left, right } from './domain/either';

@Injectable()
export class AppService {
  lobbies = new Map<string, Lobby>();

  constructor(private readonly repository: AppRepository) {}

  createLobby(body: {
    name: string;
  }): Either<Error, { lobby: Lobby; user: User }> {
    let id = Math.random().toString(36).slice(2, 6).toUpperCase();
    while (this.lobbies.has(id)) {
      id = Math.random().toString(36).slice(2, 6).toUpperCase();
    }

    const [error, lobby] = Lobby.create({
      id: id,
      lawsDeck: this.repository.cloneLawsDeck(),
      crisesDeck: this.repository.cloneCrisesDeck(),
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
    this.lobbies.set(id, lobby);
    return right({
      lobby: lobby,
      user: lobbyMember,
    });
  }

  getLobby(id: string, userId: string): Either<Error, Lobby> {
    const lobby = this.lobbies.get(id);
    if (!lobby) {
      return left(new NotFoundException());
    }

    if (!lobby.hasUser(userId)) {
      return left(new NotFoundException());
    }

    return right(lobby);
  }

  joinLobby(
    id: string,
    body: { name: string; session?: { lobbyId: string; userId: string } },
  ): Either<Error, { lobby: Lobby; user: User }> {
    const lobby = this.lobbies.get(id);
    if (!lobby) {
      return left(new NotFoundException());
    }

    const userInLobby = lobby.users.find(
      (user) => user.id === body.session?.userId,
    );

    if (!body.session || !userInLobby) {
      const lobbyMember = new User({
        id: crypto.randomUUID(),
        name: body.name,
      });
      const [error] = lobby.addUser(lobbyMember);
      if (error) {
        return left(new InternalServerErrorException(error));
      }
      return right({
        lobby: lobby,
        user: lobbyMember,
      });
    }

    return right({
      lobby: lobby,
      user: userInLobby,
    });
  }

  startGame(input: {
    lobbyId: string;
    issuerId: string;
  }): Either<Error, Lobby> {
    const lobby = this.lobbies.get(input.lobbyId);
    if (!lobby) {
      return left(new NotFoundException());
    }

    const [error] = lobby.startGame(input.issuerId);
    if (error) {
      return left(new InternalServerErrorException(error));
    }

    return right(lobby);
  }

  connectUser(
    lobbyId: string,
    userId: string,
    socketId: string,
  ): Either<Error, Lobby> {
    const lobby = this.lobbies.get(lobbyId);
    if (!lobby) {
      return left(new NotFoundException());
    }
    const [error] = lobby.connectUser(userId, socketId);
    if (error) {
      return left(new NotFoundException(error));
    }
    return right(lobby);
  }

  disconnectUser(userId: string, lobbyId: string): Either<Error, Lobby> {
    const lobby = this.lobbies.get(lobbyId);
    if (!lobby) {
      return left(new NotFoundException());
    }

    const [error] = lobby.disconnectUser(userId);

    if (error) {
      return left(new NotFoundException(error));
    }

    return right(lobby);
  }

  kickUser(input: {
    lobbyId: string;
    userId: string;
    issuerId: string;
  }): Either<Error, Lobby> {
    const lobby = this.lobbies.get(input.lobbyId);
    if (!lobby) {
      return left(new NotFoundException());
    }

    const [error] = lobby.removeUser(input.userId, input.issuerId);
    if (error) {
      return left(new NotFoundException(error));
    }

    return right(lobby);
  }
}
