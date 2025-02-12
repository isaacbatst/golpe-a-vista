import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppRepository } from './app.repository';
import { AppService } from './app.service';
import { LobbyGateway } from './lobby.gateway';
import { SessionModule } from './modules/session/session.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), SessionModule],
  controllers: [AppController],
  providers: [LobbyGateway, AppService, AppRepository],
})
export class AppModule {}
