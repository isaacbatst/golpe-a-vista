import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { ChatGateway } from './chat.gateway';
import { SessionModule } from './modules/session.module';
import { AppService } from './app.service';
import { AppRepository } from './app.repository';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), SessionModule],
  controllers: [AppController],
  providers: [ChatGateway, AppService, AppRepository],
})
export class AppModule {}
