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
  createLobby(@Req() req: Request, @Body() body: { name: string }) {
    const { lobby, user } = this.service.createLobby(body);
    req.session.lobbyId = lobby.id;
    req.session.userId = user.id;
    return {
      id: lobby.id,
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
    return this.service.getLobby(id);
  }

  @Post('lobbies/:id/join')
  joinLobby(
    @Param('id') id: string,
    @Req() req: Request,
    @Body() body: { name: string },
  ) {
    const { lobby, user } = this.service.joinLobby(id, body);
    req.session.lobbyId = id;
    req.session.userId = user.id;
    return lobby;
  }
}
