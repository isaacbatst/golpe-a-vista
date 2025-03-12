import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';

@Injectable()
export class SecretService {
  constructor(private readonly configService: ConfigService) {}
  get(key: string, defaultValue: string): string {
    const filePath = this.configService.get<string>(`${key}_FILE`);
    if (filePath && fs.existsSync(filePath)) {
      return fs.readFileSync(filePath, 'utf8').trim();
    }
    return this.configService.get<string>(key, defaultValue);
  }
}
