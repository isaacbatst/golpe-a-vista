# Golpe à Vista (Congresso Simulator)

Jogo de dedução social com temática política brasileira. Monorepo fullstack com Next.js + NestJS + Socket.io.

- **Produção**: congressosimulator.com.br | api.congressosimulator.com.br
- **Repo**: github.com/isaacbatst/golpe-a-vista

## Estrutura

```
app/   → Frontend: Next.js 15 (React 19, App Router, Tailwind, Shadcn/ui)
api/   → Backend:  NestJS 11 (Socket.io, Redis sessions, DDD)
```

## Comandos

| Ação | API (`api/`) | App (`app/`) |
|------|-------------|-------------|
| Dev | `npm run start:dev` | `npm run dev` |
| Build | `npm run build` | `npm run build` |
| Test | `npm run test` | `npm run test` |
| Lint | `npm run lint` | `npm run lint` |
| Format | `npm run format` | — |
| Docker | `docker compose up` (raiz — sobe Redis + API:3001 + App:3000) |

## Convenções de Código

- TypeScript strict em ambos os projetos
- Validação com Zod nos boundaries (endpoints, forms)
- Error handling funcional com `Either<Left, Right>` no domínio (`api/src/domain/either.ts`)
- Testes unitários para lógica de domínio em `api/src/domain/`
- API: arquitetura DDD — lógica em `src/domain/`, infra em `src/modules/`
- API: Prettier com single quotes e trailing commas
- App: componentes Shadcn/ui (New York style), path alias `@/*` → `./src/*`
- App: SWR para server state, React Hook Form para forms, Socket.io-client para real-time

## Convenções de Git

Commits em português com emoji prefix:
- ✨ Nova feature
- 🐛 Bug fix
- 💄 UI/estilo
- ♻️ Refatoração
- 🧱 Infraestrutura
- 💬 Textos/conteúdo
- ✅ Testes
- 📝 Documentação

Branch principal: `main`. Deploy automático via GitHub Actions ao push na main.

## Linear — Gestão de Projeto

O time **Game Dev** gerencia múltiplos jogos. Cada jogo é identificado por **project labels**:
- `Congresso Simulator` — este repositório
- `Dev Simulator` — outro jogo do time

### Contexto deste repo no Linear
- **Team**: Game Dev
- **Initiative**: Congresso Simulator v2
- **Projeto principal**: Playtest Feedback - Balancing & UX
- **Issue labels**: Bug, Feature, Improvement
- **Status workflow**: Backlog → Todo → In Progress → In Review → Done

### Workflow
1. Ao pegar uma task: buscar issue no Linear → marcar **In Progress**
2. Durante o trabalho: referenciar o identificador da issue nos commits
3. Ao criar PR: linkar a issue
4. Ao concluir: marcar **Done** (ou **In Review** se precisar de revisão)
5. Novas issues: sempre incluir label (Bug/Feature/Improvement), associar ao projeto correto e usar project label `Congresso Simulator`

### Criando issues para este projeto
Ao criar issues no Linear para este repositório, sempre usar:
- **team**: Game Dev
- **project**: Playtest Feedback - Balancing & UX (ou o projeto relevante da initiative)
- **labels**: incluir Bug/Feature/Improvement conforme o tipo

## Regras para o Claude

- Responder em **português brasileiro** (pt-BR)
- Preferir editar arquivos existentes a criar novos
- Rodar lint e testes após mudanças significativas
- Não alterar configurações de Docker/CI sem confirmação
- Ao trabalhar com game logic, consultar os READMEs para entender as regras
- Manter o pattern `Either<L,R>` para error handling no domínio
- Ao interagir com Linear, sempre filtrar por `Congresso Simulator` quando relevante
