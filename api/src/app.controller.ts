import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
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
    const [addPlayerError] = lobby.addPlayer(body.name);
    if (addPlayerError) {
      throw new InternalServerErrorException(addPlayerError);
    }
    this.lobbies.set(lobbyId, lobby);
    return {
      id: lobbyId,
    };
  }

  @Get('lobbies/:id')
  getLobby(@Param('id') id: string) {
    const lobby = this.lobbies.get(id);
    if (!lobby) {
      return null;
    }
    return lobby;
  }
}
