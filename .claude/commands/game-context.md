# Carregar contexto das regras do jogo

Antes de trabalhar em lógica do jogo, carregue o contexto necessário.

1. Leia os arquivos de regras:
   - `README.md` (regras v1)
   - `README-v2.md` (regras v2 — versão atual)
2. Leia os arquivos de dados do jogo:
   - `api/src/data/laws.ts` (leis disponíveis)
   - `api/src/data/sabotage-cards.ts` (sabotagens disponíveis)
3. Leia o pattern de error handling: `api/src/domain/either.ts`
4. Identifique os stages existentes em `api/src/domain/stage/`

Apresente um resumo das regras atuais e da arquitetura do domínio.

Se `$ARGUMENTS` mencionar um stage específico (ex: "impeachment", "legislative", "sabotage-card"), foque nesse stage e leia sua implementação completa.
