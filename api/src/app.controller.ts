import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { Lobby } from './domain/lobby';
import crypto from 'crypto';

@Controller()
export class AppController {
  lobbies = new Map<string, Lobby>();

  @Post('lobbies')
  createLobby(@Body() body: { name: string }) {
    const [error, lobby] = Lobby.create();
    if (!lobby) {
      throw new InternalServerErrorException(error);
    }
    const lobbyId = crypto.randomUUID();
    this.lobbies.set(lobbyId, lobby);
    const [addPlayerError] = lobby.addPlayer(body.name);
    if (addPlayerError) {
      throw new InternalServerErrorException(addPlayerError);
    }
    return {
      id: lobbyId,
    };
  }
}
