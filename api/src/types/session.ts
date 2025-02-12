import 'express-session';

declare module 'express-session' {
  interface SessionData {
    lobbyId: string;
    userId: string;
  }
}
