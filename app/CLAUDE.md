# App — Frontend (Next.js)

Next.js 15 com App Router, React 19, Tailwind CSS, Shadcn/ui.

## Stack
- **UI**: Shadcn/ui (New York style) + Radix primitives + Lucide icons
- **Forms**: React Hook Form + Zod resolver
- **State**: SWR (server), React context (local)
- **Real-time**: Socket.io-client
- **Toasts**: Sonner

## Estrutura de pastas
```
src/
├── app/              # App Router (pages, layouts)
│   ├── join/[id]/    # Entrar no jogo
│   └── lobby/[id]/   # Lobby principal
│       ├── stages/   # Fases do jogo (legislativo, impeachment, etc.)
│       ├── sabotage-card-card/
│       └── law-card/
├── components/       # Componentes reutilizáveis
│   └── ui/           # Componentes Shadcn/ui (não editar manualmente)
└── lib/              # Hooks, utils, helpers
```

## Convenções
- Path alias: `@/*` → `./src/*`
- Componentes Shadcn em `src/components/ui/` — adicionar via CLI, não editar diretamente
- Usar `cn()` de `@/lib/utils` para merge de classes Tailwind
- API_URL configurada via `NEXT_PUBLIC_API_URL`
