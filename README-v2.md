# Golpe à Vista — v2

## Setup

6 jogadores. Deck: 20 cartas (13C / 7P).

| Papel | Qtd | Sabe quem |
|---|---|---|
| Moderado | 3 | Ninguém |
| Conservador | 2 | O outro Conservador |
| Radical | 1 | Ninguém |

## Vitória

O jogo acaba no instante que qualquer condição é atingida.

| Facção | Por leis | Por impeachment |
|---|---|---|
| Moderados | 5P  | Cassar 2 Conservadores |
| Conservadores | 5C  | Cassar o Radical |
| Radical | — (não vence por leis diretamente) | — (vence apenas pelos caminhos) |

### Caminhos do Radical

Quando um gate é atingido (3P ou 3C), o Radical **pode escolher ativar** aquele caminho — ou **esperar** pelo outro gate. Uma vez feita a escolha, não pode mudar. Os caminhos são **mutuamente exclusivos**:

| Caminho | Gate | Win condition |
|---|---|---|
| **Revolução** (3P) | 3 leis P aprovadas | **Maioria Convertida** — O Radical precisa converter **todos os 3 Moderados**. Se os 3 estiverem radicalizados, Radical vence. |
| **Golpe Institucional** (3C) | 3 leis C aprovadas | **Golpe Institucional** — Se o Radical for indicado como Ministro da Justiça, pode declarar Golpe: revela seu papel, jogo acaba, Radical vence. |

- A escolha é **secreta** — a mesa não sabe se o Radical já ativou um caminho ou ainda está esperando
- Se 3P chegar primeiro, o Radical pode ativar Revolução ou deixar passar e esperar 3C para ativar Golpe Institucional
- Isso impede que a mesa deduza automaticamente o caminho pelo estado do tabuleiro
- **Revolução (3P):** mais seguro (Radical parece aliado dos Moderados), mas precisa converter todos os 3 Moderados — win condition mais lento
- **Golpe Institucional (3C):** mais perigoso (alimenta Conservadores E ativa impeachment contra si), mas pode fechar o jogo num único momento se for indicado Ministro da Justiça — win condition explosivo. A indicação é uma decisão social ativa (o presidente escolhe), criando responsabilidade e tensão na nomeação.

## Rodada

1. **Sabotagem** (opcional) — Conservadores podem jogar uma sabotagem no início da rodada, antes da legislação
2. **Presidente** é anunciado (rotação)
3. **Presidente indica seu Ministro da Justiça** — o presidente escolhe quem será seu MJ para este mandato
4. **Discussão** — Presidente faz seu caso, jogadores debatem sabendo quem é o MJ indicado
5. **Votação de Confiança** — Votação secreta: aprovar ou rejeitar o governo (presidente + MJ)
   - **Aprovado** → Presidente compra 3 leis, veta 1, empurra 1 diretamente (sem votação na lei). Lei é revelada a todos.
   - **Rejeitado** → Pula para próxima rodada. Rejeições acumulam para desbloquear crises e impeachments.
6. **Inquérito** — Ministro da Justiça recebe as 2 leis não-vetadas (única verificação da honestidade do presidente)
7. **Próxima rodada**

## Sabotagens

Conservadores possuem **2 sabotagens** no jogo: uma Obstrução e uma Interceptação. Cada uma é **uso único** — uma vez jogada, é consumida permanentemente.

| Sabotagem | Tipo | Efeito |
|---|---|---|
| Obstrução | Defesa | Inquérito da rodada é anulado — o Ministro da Justiça não recebe nada |
| Interceptação | Ataque | Conservadores veem e trocam 1 carta do próximo presidente antes do draw |

- A sabotagem pode ser jogada **no início de qualquer rodada**, antes da legislação
- Sabotagens são **invisíveis** para a mesa — ninguém sabe se ou quando foi usada
- **Obstrução**: protege um presidente Conservador de ser exposto pelo inquérito. Apenas o MJ sabe que não recebeu informação — ele precisa decidir se denuncia publicamente ou guarda pra si
- **Interceptação**: manipula o draw do próximo presidente — pode forçar 3C ou remover a única P. Uso ideal quando Moderado/Radical é presidente e precisa ser sabotado

## Rejeições: Crises e Impeachment

Rejeições na votação de confiança acumulam e disparam efeitos alternados:

| Rejeição | Efeito |
|---|---|
| 3ª rejeição | **Impeachment** |
| 4ª rejeição | **Crise** |
| 5ª rejeição | **Impeachment** |
| 6ª rejeição | **Crise** |
| ... | alternando |

### Crises

Crises são efeitos aleatórios causados pela instabilidade política. Quando uma crise é disparada, a **lei no topo do deck é aprovada automaticamente** — ninguém escolhe, ninguém vota. A lei é revelada e conta para o placar normalmente.

### Impeachment

Quando impeachment é disparado, o **presidente da rodada** conduz o processo: todos os jogadores (exceto o presidente) apontam simultaneamente para quem querem cassar (**point at**). O jogador mais apontado é cassado. Em caso de empate, o presidente desempata.

- Alvo é Conservador: Conservador é cassado sem revelar identidade. Se ambos os Conservadores forem cassados, vitória imediata dos Moderados.
- Alvo é Radical: vitória imediata dos Conservadores
- Alvo é Moderado: sem efeito (identidade não é revelada)

Jogador cassado perde elegibilidade à presidência, mantém voto.

## Receio e Radicalização

### Receio

Moderados têm **receio**: não participam do apontamento em impeachment (se abstêm). Apenas Conservadores e Radical apontam por padrão.

| Moderados radicalizados | Quem aponta em impeachment | Equilíbrio |
|---|---|---|
| 0 | 2C + 1R (3 votos) | Conservadores dominam (2/3) |
| 1 | 2C + 1R + 1M (4 votos) | Conservadores têm 50% |
| 2 | 2C + 1R + 2M (5 votos) | Conservadores em minoria (2/5) |
| 3 | 2C + 1R + 3M (6 votos) | Conservadores em minoria (2/6) — Radical vence (Path Revolução) |

### Radicalização

Disponível **desde o início do jogo**. Quando o Radical é **Ministro da Justiça**, pode tentar radicalizar o presidente daquela rodada:

- **Alvo é Moderado:** radicalização funciona. O Moderado perde o receio e passa a participar do apontamento em impeachment. O Moderado **não muda de time** — continua com win conditions de Moderado. Mas conta como "radicalizado" para o win condition do Radical (Path Revolução). **O Moderado descobre a identidade do Radical** — a radicalização é uma faca de dois gumes: o Radical ganha progresso e um aliado no impeachment, mas se expõe.
- **Alvo é Conservador:** radicalização falha. O Conservador descobre a identidade do Radical — informação letal que pode ser usada para denunciar ou coordenar cassação.

O risco é alto em ambos os cenários: errar um Conservador é potencialmente fatal, e acertar um Moderado expõe a identidade do Radical. Cada radicalização aumenta o número de jogadores que sabem quem o Radical é.

### Efeitos da radicalização no Moderado

| Efeito | Antes | Depois |
|---|---|---|
| Impeachment | Abstém (receio) | Aponta normalmente (voto conta pra cassação) |
| Identidade do Radical | Desconhecida | Conhecida (sabe quem é o Radical) |
| Time | Moderado | Moderado (não muda) |

### Exposição do Radical por radicalização

| Radicalizações | Quem sabe quem é o Radical | Risco de exposição |
|---|---|---|
| 0 | Ninguém | Seguro, mas sem progresso |
| 1 | 1 Moderado | Exposição contida — 1 potencial delator |
| 2 | 2 Moderados | Maioria dos Moderados sabe |
| 3 (Revolução) | Todos os Moderados | Totalmente exposto |

**Dilema do Moderado radicalizado:** sabe quem é o Radical, mas expor essa informação também ajuda os Conservadores (que podem usar pra cassar o Radical). O Moderado precisa decidir se usa a informação, quando, e com quem compartilha.

### Quantidade de conversões por path

- **Path Revolução (3P):** 3 Moderados radicalizados (todos) = win condition
- **Path Golpe Institucional (3C):** até 1 radicalização (ferramenta estratégica, não é win condition)
- **Antes de ativar qualquer path:** até 1 radicalização disponível

## Dinâmica Central

- **Moderados** querem 5P ou cassar os 2 Conservadores: empurrar progressistas, bloquear conservadoras e usar impeachment a seu favor. São maioria (3 jogadores) e definem o ritmo da votação de confiança. Têm receio (não apontam em impeachment) até serem radicalizados — o que cria um dilema: querem voz no impeachment para cassar Conservadores, mas ser radicalizado avança o win condition do Radical.
- **Conservadores** querem velocidade em C: chegar a 5C ou cassar o Radical. Usam sabotagens (CPI Falsa pra cobrir, Interceptação pra atacar) e empurram C quando aprovados.
- **Radical** não vence por leis nem por impeachment direto — vence exclusivamente pelos caminhos (Revolução ou Golpe Institucional). Joga o meta-game. Quando um gate é atingido (3P ou 3C), o Radical pode ativar aquele caminho ou esperar pelo outro. A mesa nunca sabe se o Radical já escolheu ou ainda está esperando. Cada radicalização dá progresso mas expõe sua identidade — precisa confiar que os radicalizados não vão delatá-lo.

**Votação de confiança como motor:** Jogadores votam no **governo** (presidente + MJ), não em leis. A mesa sabe quem é o MJ antes de votar — criando uma camada extra de decisão social. Presidentes podem trair — conservador aprovado pode empurrar C mesmo dizendo que empurraria P. O Ministro da Justiça é a única verificação.

**Dilema de rejeição:** Rejeitar um presidente acumula rejeições que alternam entre crises (leis automáticas do topo do deck) e impeachments. Rejeições frequentes aceleram o jogo político — bom pro Radical (mais chances de cassar Conservadores), mas crises podem aprovar leis conservadoras inesperadas. Arriscado pra todos.

**Progressão por C laws:** Cada C aprovada fortalece Conservadores — mas também pode estar alimentando o path Golpe Institucional do Radical.

**O enigma do Radical:** Mesmo depois de 3P ou 3C serem atingidos, a mesa não sabe se o Radical ativou aquele caminho ou está esperando o outro. Um jogador empurrando P pode ser Moderado ou Radical querendo Revolução. Um jogador empurrando C pode ser Conservador ou Radical querendo Golpe Institucional. Essa ambiguidade persiste durante todo o jogo.

**Indicação do Ministro da Justiça como momento crítico:** Após 3C, indicar alguém como Ministro da Justiça pode entregar a vitória ao Radical (Golpe Institucional). O presidente precisa ponderar: o MJ é a única verificação de honestidade, mas indicar a pessoa errada pode acabar o jogo. A mesa vota sabendo quem é o MJ — então todos compartilham a responsabilidade de aprovar ou rejeitar o governo. Moderados radicalizados têm informação privilegiada para ajudar nessa decisão — se escolherem compartilhar.

**Radicalização como faca de dois gumes:** O Radical ganha progresso e aliados no impeachment, mas cada Moderado radicalizado conhece sua identidade. O Radical precisa confiar nos radicalizados, e os radicalizados precisam decidir o que fazer com a informação — criar um equilíbrio de confiança assimétrica que alimenta a tensão social do jogo.

## Nova nomenclatura

- Dossiê -> Inquérito
- Relator da CPI -> Ministro da Justiça
- Path Golpe -> Path Golpe Institucional
- Crises (v1, cartas dos Conservadores) -> Sabotagens
- Sabotagem (v1, carta específica) -> Interceptação
- Crises (v2) -> efeito de rejeições pares (lei automática do topo do deck)