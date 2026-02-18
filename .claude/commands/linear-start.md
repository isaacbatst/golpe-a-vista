# Iniciar trabalho em uma issue do Linear

Busque a issue do Linear com identificador `$ARGUMENTS`.

1. Use `mcp__linear-server__get_issue` para ler a issue completa (título, descrição, labels, projeto)
2. Leia os comentários da issue com `mcp__linear-server__list_comments`
3. Resuma a issue: o que precisa ser feito, critérios de aceitação, contexto relevante
4. Identifique quais arquivos do projeto provavelmente serão afetados
5. Atualize o status da issue para **In Progress**
6. Crie uma branch git a partir da main com nome descritivo baseado no identificador da issue (ex: `feat/GAM-123-descricao-curta`)

Se a issue não tiver descrição suficiente, aponte o que está faltando antes de começar.

Após o resumo, entre em modo de planejamento (EnterPlanMode) para definir a estratégia de implementação antes de executar.
