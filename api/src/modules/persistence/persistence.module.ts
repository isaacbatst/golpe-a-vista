import { Module } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';
import { RedisService } from './redis.service';

@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: async (): Promise<RedisClientType> => {
        const client = createClient();
        await client.connect();
        return client as RedisClientType;
      },
    },
    RedisService,
  ],
  exports: [RedisService, 'REDIS_CLIENT'],
})
export class PersistenceModule {}
