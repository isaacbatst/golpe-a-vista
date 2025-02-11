import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Req,
  Session,
  UnauthorizedException,
} from '@nestjs/common';
import crypto from 'crypto';
import { Request } from 'express';
import { SessionData } from 'express-session';
import { Lobby } from './domain/lobby';
import { User } from './domain/user';

@Controller()
export class AppController {
  lobbies = new Map<string, Lobby>();

  @Post('lobbies')
  createLobby(@Req() req: Request, @Body() body: { name: string }) {
    let id = Math.random().toString(36).slice(2, 6).toUpperCase();
    while (this.lobbies.has(id)) {
      id = Math.random().toString(36).slice(2, 6).toUpperCase();
    }
    const [error, lobby] = Lobby.create(id);
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
    req.session.lobbyId = id;
    req.session.userId = lobbyMember.id;
    return {
      id,
    };
  }

  @Get('lobbies/:id')
  getLobby(@Param('id') id: string, @Session() session: SessionData) {
    if (!session) {
      throw new ForbiddenException();
    }

    if (session.lobbyId !== id) {
      throw new UnauthorizedException();
    }
    const lobby = this.lobbies.get(id);
    if (!lobby) {
      return null;
    }
    return lobby;
  }

  @Post('lobbies/:id/join')
  joinLobby(
    @Param('id') id: string,
    @Req() req: Request,
    @Body() body: { name: string },
  ) {
    const lobby = this.lobbies.get(id);
    if (!lobby) {
      throw new ForbiddenException();
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
    req.session.lobbyId = id;
    req.session.userId = lobbyMember.id;
    return lobby;
  }
}
