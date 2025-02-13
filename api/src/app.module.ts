import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { DeckRepository } from './deck.repository';
import { AppService } from './app.service';
import { LobbyGateway } from './lobby.gateway';
import { SessionModule } from './modules/session/session.module';
import { PersistenceModule } from './modules/persistence/persistence.module';
import { LobbyRepository } from './lobby.repository';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SessionModule,
    PersistenceModule,
  ],
  controllers: [AppController],
  providers: [LobbyGateway, AppService, DeckRepository, LobbyRepository],
})
export class AppModule {}
