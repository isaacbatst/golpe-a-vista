# API — Backend (NestJS)

NestJS 11 com Socket.io, Redis sessions, arquitetura DDD.

## Stack
- **Framework**: NestJS 11 (SWC compiler)
- **WebSocket**: Socket.io via @nestjs/platform-socket.io
- **Sessions**: express-session + connect-redis + Redis
- **Validação**: Zod

## Estrutura de pastas
```
src/
├── domain/           # Lógica de negócio (pura, sem dependências de framework)
│   ├── stage/        # Implementações das fases do jogo
│   ├── sabotage-card/ # Lógica de sabotagens
│   ├── lobby.ts      # Estado do lobby/partida
│   ├── deck.ts       # Deck de cartas
│   ├── president-queue.ts
│   └── either.ts     # Either<Left, Right> para error handling
├── data/             # Dados estáticos (leis, sabotagens)
├── modules/          # Módulos NestJS (infra)
│   ├── core/         # Serviços principais
│   ├── persistence/  # Persistência de dados
│   └── session/      # Gerenciamento de sessão
├── filters/          # Exception filters (WebSocket)
└── types/            # Type definitions
```

## Convenções
- **DDD**: lógica de negócio em `domain/`, sem imports do NestJS. Infra em `modules/`
- **Error handling**: usar `Either<Left, Right>` (ver `domain/either.ts`), nunca throw em domain
- **Testes**: arquivos `.test.ts` ao lado do código em `domain/`. Rodar com `npm run test`
- **Prettier**: single quotes, trailing commas (`.prettierrc`)
- **Sessions**: estado do jogo persistido via Redis, acessado por session ID
