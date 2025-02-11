import { Module, NestModule, MiddlewareConsumer, Inject } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import session from 'express-session';

@Module({
  imports: [ConfigModule],
})
export class SessionModule implements NestModule {
  constructor(@Inject(ConfigService) private configService: ConfigService) {}

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        session({
          secret: this.configService.get<string>(
            'SESSION_SECRET',
            'default_secret',
          ),
          resave: false,
          saveUninitialized: false,
          cookie: {
            secure: this.configService.get<boolean>('SESSION_SECURE', false),
            domain: this.configService.get<string>('SESSION_DOMAIN'),
            httpOnly: true,
            sameSite:
              this.configService.get<string>('NODE_ENV') === 'production'
                ? 'strict'
                : 'lax',
            maxAge: this.configService.get<number>('SESSION_MAX_AGE', 86400000), // 24 horas
          },
        }),
      )
      .forRoutes('*');
  }
}
