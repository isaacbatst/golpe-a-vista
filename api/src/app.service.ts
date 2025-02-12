import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import crypto from 'crypto';
import { AppRepository } from './app.repository';
import { Lobby } from './domain/lobby';
import { User } from './domain/user';

@Injectable()
export class AppService {
  lobbies = new Map<string, Lobby>();

  constructor(private readonly repository: AppRepository) {}

  createLobby(body: { name: string }) {
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
      throw new InternalServerErrorException(error);
    }
    const lobbyMember = new User({
      id: crypto.randomUUID(),
      name: body.name,
      isHost: true,
    });
    const [addPlayerError] = lobby.addUser(lobbyMember);
    if (addPlayerError) {
      throw new InternalServerErrorException(addPlayerError);
    }
    this.lobbies.set(id, lobby);
    return {
      lobby: lobby,
      user: lobbyMember,
    };
  }

  getLobby(id: string) {
    const lobby = this.lobbies.get(id);
    if (!lobby) {
      return null;
    }
    return lobby;
  }

  joinLobby(id: string, body: { name: string }) {
    const lobby = this.lobbies.get(id);
    if (!lobby) {
      throw new NotFoundException();
    }
    const lobbyMember = new User({
      id: crypto.randomUUID(),
      name: body.name,
    });
    const [error] = lobby.addUser(lobbyMember);
    if (error) {
      throw new InternalServerErrorException(error);
    }
    return {
      lobby: lobby,
      user: lobbyMember,
    };
  }

  connectUser(lobbyId: string, userId: string, socketId: string) {
    const lobby = this.lobbies.get(lobbyId);
    if (!lobby) {
      throw new NotFoundException();
    }
    const [error] = lobby.connectUser(userId, socketId);
    if (error) {
      throw new NotFoundException(error);
    }
  }

  disconnectUser(lobbyId: string, userId: string) {
    const lobby = this.lobbies.get(lobbyId);
    if (!lobby) {
      throw new NotFoundException();
    }
    const [error] = lobby.disconnectUser(userId);
    if (error) {
      throw new NotFoundException(error);
    }
  }
}
