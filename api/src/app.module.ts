import { Module } from '@nestjs/common';
import { CoreModule } from 'src/modules/core/core.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DeckRepository } from './deck.repository';
import { LobbyGateway } from './lobby.gateway';
import { LobbyRepository } from './lobby.repository';

@Module({
  imports: [CoreModule],
  controllers: [AppController],
  providers: [LobbyGateway, AppService, DeckRepository, LobbyRepository],
})
export class AppModule {}
