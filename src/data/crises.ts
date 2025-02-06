const CRISES = {
  PLANO_COHEN: {
    titles: ["Plano Cohen", "Dossiê Fake do PCC", "Arquivo Secreto da CPI"],
    description:
      "O Presidente descobre que o Dossiê contém informação falsificada ou manipulada estrategicamente. Ele pode alertar ou não os outros jogadores, mas ninguém sabe se é blefe ou verdade. 'A verdade é um campo de batalha.'",
    type: "Oculta",
  },
  MENSALAO: {
    titles: ["Mensalão", "O Mensalinho", "Operação Caixa 2"],
    description:
      "O Presidente pode forçar um jogador específico a votar a favor da próxima lei aprovada. Só os dois sabem, mas podem fingir que nada aconteceu. 'Vote certo e talvez tenha uma vaguinha no ministério depois...'",
    type: "Oculta",
  },
  CAFE_COM_A_ABIN: {
    titles: [
      "Café com a ABIN",
      "Visita do FBI",
      "Papo Reto com a Inteligência",
    ],
    description:
      "O jogador que receberia o Dossiê teve um encontro inesperado com agentes estrangeiros e agora não sabe de nada. Em termos de jogo, ele não recebe nada nesta rodada.",
    when: "before_dossier",
    type: "Oculta",
  },
  OPERACAO_MAOS_LIMPAS: {
    titles: [
      "Operação Mãos Limpas",
      "Caixa Preta da República",
      "Relatório da Receita Federal",
    ],
    description:
      "O Presidente recebe um fato verdadeiro sobre uma votação anterior, mas só pode revelar se quiser (ou blefar sobre outra coisa). 'A questão é: será que ele realmente tem provas?'",
    type: "Oculta",
  },
  O_FMI_MANDOU: {
    titles: ["O FMI Mandou", "O Dolár Subiu", "A Bolsa Caiu"],
    description:
      "O Presidente deve vetar uma lei progressista, se possível. Um famoso editorial disse que 'o mercado não gostou', e agora não há mais o que fazer.",
    type: "Oculta",
  },
  FORCAS_OCULTAS: {
    titles: [
      "Forças Ocultas",
      "Illuminati Confirmed",
      "Os Rothschild Intervêm",
      "Reptilianos dão as caras",
      "Nova Ordem Mundial Contra-Ataca!",
    ],
    description:
      "O Presidente é obrigado a votar a favor da lei em votação, independentemente de sua facção. 'Por motivos de força maior, a decisão foi tomada por nós.'",
    type: "Oculta",
  },
  REGIME_DE_URGENCIA: {
    titles: ["Regime de Urgência", "Votação Relâmpago", "PEC da Madrugada"],
    description:
      "Um setor se articulou para apressar a votação e agora o Presidente deve vetar uma lei e escolher outra em 5 segundos, ou a primeira da pilha será aprovada. Os outros jogadores têm 5 segundos para votar, ou será aprovada automaticamente, já que 'os políticos trabalham rápido quando convém'.",
    type: "Pública",
  },
  CPI_DA_MADRUGADA: {
    titles: [
      "CPI da Madrugada",
      "Sessão Secreta",
      "O Que Os Olhos Não Veem...",
    ],
    description:
      "A votação desta rodada é feita secretamente (sem revelar quem votou em quê). 'Foi tudo resolvido em uma reunião discreta na calada da noite.'",
    type: "Pública",
  },
  GOLPE_DE_ESTADO: {
    titles: ["Golpe de Estado", "Pedalada Fiscal", "Tudo por um Fiat Elba..."],
    description:
      "O presidente foi pego em um escândalo! O Presidente perde imediatamente o turno, e a presidência passa para o próximo jogador. 'Por razões de estabilidade nacional, a liderança foi alterada.'",
    type: "Pública",
  },
  VAZAMENTO_NO_WIKILEAKS: {
    titles: [
      "Vazamento no WikiLeaks",
      "Dossiê Snowden",
      "Lei da Transparência",
    ],
    description:
      "Uma cópia do Dossiê foi disponibilizada na internet e todos os jogadores podem ver. 'Bem-vindo à era da informação.'",
    when: "before_dossier",
    type: "Pública",
  },
  CONGRESSO_TRANCADO: {
    titles: [
      "Congresso Trancado",
      "Oposição Fechou a Pauta",
      "Congresso Travado",
    ],
    description:
      "O Presidente não pode vetar uma lei conservadora nesta rodada, pois a oposição trancou a pauta e está tentando empurrar a lei goela abaixo.'",
    type: "Pública",
  },
  PEGADINHA_DO_PARAGRAFO_47_INCISO_V: {
    titles: [
      "Pegadinha do Parágrafo 47 Inciso V",
      "Jabuti na Lei",
      "Burocracia a Jato",
    ],
    description:
      "A oposição conseguiu adicionar uma cláusula que torna a lei inviável. A lei não contará para a vitória de nenhuma facção. O burocrata que escreveu isso sumiu misteriosamente.",
    when: "before_dossier",
    type: "Pública",
  },
  VETO_DO_STF: {
    titles: ["Veto do STF", "Xandão Mandou", "São 3 Poderes, Não 2"],
    description:
      "O Supremo Tribunal Federal vetou a lei aprovada na rodada anterior. 'A justiça tarda, mas não falha.'",
    type: "Pública",
  },
  DELACAO_PREMIADA: {
    titles: ["Delação Premiada", "Cagueta", "X9"],
    description:
      "O Presidente pode escolher um jogador para revelar sua facção para todos. 'A verdade é uma arma poderosa.'",
    type: "Pública",
  },
  MENSAGEM_ANONIMA: {
    titles: ["Mensagem Anônima", "E-mail Anônimo", "Beijos, Anônimo"],
    description:
      "O Presidente recebe uma mensagem anônima com informações sobre um jogador. Ele pode revelar ou não. 'A verdade é uma faca de dois gumes.'",
    type: "Oculta",
  },
  TUITACO: {
    titles: ["Tuitaço", "Fake News", "Pablo Marçal"],
    description:
      "Alguém twittou um exame toxicológico falso do Presidente. O presidente não pode votar nesta rodada pois está ocupado gravando stories para se defender. 'A verdade é relativa.'",
    type: "Pública",
  },
  RECONTAGEM_VOTOS: {
    titles: ["Recontagem de Votos", "Voto Impresso Já!", "Eleição Roubada"],
    description: "Os poderosos não gostaram do resultado da última votação e decidiram recontar os votos. Se a última lei aprovada foi progressista, ela é vetada. Se foi conservadora, ela é aprovada. 'A democracia é um conceito flexível.'",
    type: "Pública",
  },
  CENSURA_ESTATAL: {
    titles: ["Censura Estatal", "Cala a Boca, Jornalista!"],
    description: "Um decreto emergencial proibiu certas informações de serem divulgadas. O Dossiê não pode ser passado nesta rodada. 'A verdade é perigosa.'",
    type: "Oculta",
  },
  PACOTE_DE_LEIS: {
    titles: ["Pacote de Leis", "O Centrão é Que Manda", "Toma Lá, Dá Cá"],
    description: "Se o presidente aprovar uma lei progressista, uma lei conservadora passará junto. 'A política é a arte do possível.'",
    type: "Pública",
  },
  VOTO_DE_MINERVA: {
    titles: ["Voto de Minerva", "Decisão da Presidência", "Decisão Final"],
    description: "Em caso de empate, o presidente decide o resultado da votação. 'A decisão final é minha.'",
    type: "Pública",
  },
  FRAUDE_ELEITORAL: {
    titles: ["Fraude Eleitoral", "Urna Eletrônica Hackeada"],
    description: "Os conservadores têm seus votos duplicados nesta rodada. 'A democracia parece melhor quando se tem dinheiro.'",
    type: "Pública",
  },
} as const;

export default CRISES;
