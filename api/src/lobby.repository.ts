import { Injectable } from '@nestjs/common';
import { RedisService } from './modules/persistence/redis.service';
import { Lobby, LobbyJSON } from './domain/lobby';

@Injectable()
export class LobbyRepository {
  constructor(private readonly redisService: RedisService) {}

  save(lobby: Lobby) {
    return this.redisService.set(`lobby:${lobby.id}`, lobby, {
      ttl: 60 * 60 * 24, // 24h
    });
  }

  async get(id: string): Promise<Lobby | null> {
    const lobby = await this.redisService.get<LobbyJSON>(`lobby:${id}`);
    return lobby ? Lobby.fromJSON(lobby) : null;
  }

  has(id: string): Promise<boolean> {
    return this.redisService.exists(`lobby:${id}`);
  }
}
