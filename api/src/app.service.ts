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
      isConnected: true,
      isHost: true,
    });
    const [addPlayerError] = lobby.addPlayer(lobbyMember);
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
      isConnected: true,
    });
    const [error] = lobby.addPlayer(lobbyMember);
    if (error) {
      throw new InternalServerErrorException(error);
    }
    return {
      lobby: lobby,
      user: lobbyMember,
    };
  }
}
