import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { ChatGateway } from './chat.gateway';
import { SessionModule } from './modules/session.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), SessionModule],
  controllers: [AppController],
  providers: [ChatGateway],
})
export class AppModule {}
