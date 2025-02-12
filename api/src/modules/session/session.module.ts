import { Inject, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import session from 'express-session';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'SESSION_MIDDLEWARE',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return session({
          secret: configService.get<string>('SESSION_SECRET', 'default_secret'),
          resave: false,
          saveUninitialized: false,
          name: 'golpe-a-vista.sid',
          cookie: {
            secure: configService.get<boolean>('SESSION_SECURE', false),
            domain: configService.get<string>('SESSION_DOMAIN'),
            httpOnly: true,
            sameSite:
              configService.get<string>('NODE_ENV') === 'production'
                ? 'strict'
                : 'lax',
            maxAge: configService.get<number>('SESSION_MAX_AGE', 86400000), // 24 horas
          },
        });
      },
    },
  ],
  exports: ['SESSION_MIDDLEWARE'],
})
export class SessionModule implements NestModule {
  constructor(
    @Inject('SESSION_MIDDLEWARE')
    private readonly sessionMiddleware: ReturnType<typeof session>,
  ) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(this.sessionMiddleware).forRoutes('*');
  }
}
