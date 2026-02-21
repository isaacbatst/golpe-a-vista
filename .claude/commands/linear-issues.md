# Listar issues do Congresso Simulator

Liste as issues do projeto Congresso Simulator no Linear.

1. Use `mcp__linear-server__list_issues` filtrando pelo team "Game Dev"
2. Se `$ARGUMENTS` estiver vazio, liste issues com status "Todo" e "In Progress"
3. Se `$ARGUMENTS` contiver um filtro (ex: "bug", "feature", "backlog"), filtre adequadamente:
   - "bug" / "feature" / "improvement" → filtrar por label
   - "backlog" / "todo" / "progress" / "review" → filtrar por status
   - "meus" / "me" → filtrar por assignee "me"
4. Apresente as issues em formato de tabela: identificador, título, status, labels, prioridade
5. Filtre apenas issues que pertencem a projetos com label "Congresso Simulator"
