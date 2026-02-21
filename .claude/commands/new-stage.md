# Criar novo stage do jogo

Crie um novo stage (fase) do jogo chamado `$ARGUMENTS`.

1. Primeiro, carregue o contexto:
   - Leia `api/src/domain/either.ts` para o pattern de error handling
   - Leia um stage existente em `api/src/domain/stage/` como referência de estrutura
   - Leia `README-v2.md` para entender as regras

2. Crie os arquivos seguindo o padrão DDD:
   - `api/src/domain/stage/{nome}-stage.ts` — lógica pura do stage
   - `api/src/domain/stage/{nome}-stage.test.ts` — testes unitários

3. Regras obrigatórias:
   - Usar `Either<Left, Right>` para todos os resultados que podem falhar
   - Zero dependências de framework (NestJS) no domain
   - Testes cobrindo os cenários principais e edge cases

4. Rode os testes: `cd api && npm run test`

Pergunte sobre as regras específicas deste stage antes de implementar, caso não estejam claras no README.
