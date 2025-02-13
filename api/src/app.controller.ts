import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Post,
  Req,
  Session,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { SessionData } from 'express-session';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly service: AppService) {}

  @Post('lobbies')
  async createLobby(@Req() req: Request, @Body() body: { name: string }) {
    const [error, created] = await this.service.createLobby(body);
    if (!created) {
      throw error;
    }
    req.session.lobbyId = created.lobby.id;
    req.session.userId = created.user.id;
    return {
      id: created.lobby.id,
    };
  }

  @Get('lobbies/:id')
  async getLobby(@Param('id') id: string, @Session() session: SessionData) {
    if (!session) {
      throw new ForbiddenException();
    }

    if (session.lobbyId !== id) {
      throw new UnauthorizedException();
    }

    const [error, lobby] = await this.service.getLobby(id, session.userId);

    if (!lobby) {
      throw error;
    }
    return lobby;
  }

  @Post('lobbies/:id/join')
  async joinLobby(
    @Param('id') id: string,
    @Req() req: Request,
    @Body() body: { name: string },
    @Session() session: SessionData,
  ) {
    const [error, joined] = await this.service.joinLobby(id, {
      name: body.name,
      session: session,
    });
    if (!joined) {
      throw error;
    }
    req.session.lobbyId = id;
    req.session.userId = joined.user.id;
    return joined.lobby;
  }

  @Get('me')
  getMe(@Session() session: SessionData) {
    if (!session) {
      throw new ForbiddenException();
    }

    return {
      id: session.userId,
    };
  }
}
