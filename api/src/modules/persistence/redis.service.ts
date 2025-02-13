import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  constructor(
    @Inject('REDIS_CLIENT') private readonly redisClient: RedisClientType,
  ) {}

  async set<T>(key: string, instance: T): Promise<void> {
    const serialized = JSON.stringify(instance);
    await this.redisClient.set(key, serialized);
  }

  async get<T>(key: string): Promise<T | null> {
    const data = await this.redisClient.get(key);
    if (!data) return null;
    return JSON.parse(data) as T;
  }

  async del(key: string): Promise<void> {
    await this.redisClient.del(key);
  }

  async onModuleDestroy() {
    await this.redisClient.quit();
  }
}
