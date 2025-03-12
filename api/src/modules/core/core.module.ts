import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SecretService } from 'src/modules/core/secret.service';
import { PersistenceModule } from 'src/modules/persistence/persistence.module';
import { SessionModule } from 'src/modules/session/session.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SessionModule,
    PersistenceModule,
  ],
  providers: [SecretService],
  exports: [SessionModule, PersistenceModule, SecretService],
})
export class CoreModule {}
