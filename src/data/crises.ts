import { CrisisType } from "../domain/crisis";

const CRISES: {
  [key: string]: {
    titles: string[];
    description: string;
    type: CrisisType;
    when?: "before_dossier";
  };
} = {
  PLANO_COHEN: {
    titles: ["Plano Cohen", "Dossiê Fake do PCC", "Arquivo Secreto da CPI"],
    description:
      "O Presidente descobre que o Dossiê dessa rodada contém informação falsificada ou manipulada estrategicamente. 'A verdade é um campo de batalha.'",
    type: CrisisType.OCULTA,
  },
  MENSALAO: {
    titles: ["Mensalão", "Caixa 2", "Propina"],
    description:
      "O Presidente forçará um jogador específico a votar a favor da próxima lei. Seu voto contará por dois nessa ocasião. 'Democracia é bom, mas dinheiro é melhor.'",
    type: CrisisType.OCULTA,
  },
  CAFE_COM_A_ABIN: {
    titles: [
      "Café com a ABIN",
      "Visita do FBI",
      "Papo Reto com a Inteligência",
      "Carro Preto na Porta",
      "MIB",
    ],
    description:
      "O jogador que receberia o Dossiê terá um encontro inesperado, ele não lembrará de nada. Em termos de jogo, ele não receberá o Dossiê.",
    type: CrisisType.OCULTA,
  },
  OPERACAO_MAOS_LIMPAS: {
    titles: [
      "Operação Mãos Limpas",
      "Caixa Preta da República",
      "Relatório da Receita Federal",
    ],
    description:
      "O Presidente recebe um relatório indicando qual foi a lei vetada. 'A questão é: será que ele realmente tem provas?'",
    type: CrisisType.OCULTA,
  },
  O_FMI_MANDOU: {
    titles: ["O FMI Mandou", "O Dolár Subiu", "A Bolsa Caiu"],
    description:
      "O Presidente deve vetar uma lei progressista, se possível. Um famoso editorial disse que 'o mercado não gostou', e agora não há mais o que fazer.",
    type: CrisisType.OCULTA,
  },
  FORCAS_OCULTAS: {
    titles: [
      "Forças Ocultas",
      "Illuminati Confirmed",
      "Os Rothschild Intervêm",
      "Reptilianos dão as caras",
      "Nova Ordem Mundial Contra-Ataca!",
      "Anunnaki na Área",
    ],
    description:
      "O Presidente é obrigado a vetar uma lei progressista. 'Por motivos de força maior, a decisão foi tomada por nós.'",
    type: CrisisType.OCULTA,
  },
  REGIME_DE_URGENCIA: {
    titles: ["Regime de Urgência", "Votação Relâmpago", "PEC da Madrugada"],
    description:
      "Um setor se articulou para apressar a votação e agora o Presidente deve vetar uma lei e escolher outra em 5 segundos, ou a primeira da pilha será aprovada. Os outros jogadores têm 5 segundos para votar, ou será aprovada automaticamente, já que 'os políticos trabalham rápido quando convém'.",
    type: CrisisType.PUBLICA,
  },
  SESSEAO_SECRETA: {
    titles: ["Sessão Secreta", "O Que Os Olhos Não Veem..."],
    description:
      "A votação desta rodada é feita secretamente. 'Foi tudo resolvido em uma reunião discreta na calada da noite.'",
    type: CrisisType.PUBLICA,
  },
  GOLPE_DE_ESTADO: {
    titles: [
      "Golpe de Estado",
      "Pedalada Fiscal",
      "Tudo por um Fiat Elba...",
      "Lava Jato",
    ],
    description:
      "O presidente foi pego com a boca na butija, a presidencia é passada para o próximo jogador na ordem de jogo. 'Agora sim, o Brasil vai pra frente!'",
    type: CrisisType.PUBLICA,
  },
  VAZAMENTO_NO_WIKILEAKS: {
    titles: ["Vazamento no WikiLeaks", "Snowden Contra-Ataca", "Vaza Jato"],
    description:
      "Uma cópia parcial do Dossiê foi disponibilizada na internet. Todos verão uma das cartas que não foi vetada. 'Bem-vindo à era da informação.'",
    when: "before_dossier",
    type: CrisisType.PUBLICA,
  },
  CONGRESSO_TRANCADO: {
    titles: [
      "Congresso Trancado",
      "Oposição Fechou a Pauta",
      "Congresso Travado",
    ],
    description:
      "O Presidente não pode vetar uma lei conservadora nesta rodada, pois a oposição trancou a pauta e quer empurrar a lei goela abaixo.'",
    type: CrisisType.PUBLICA,
  },
  PEGADINHA_DO_PARAGRAFO_47_INCISO_V: {
    titles: [
      "Pegadinha do Parágrafo 47 Inciso V",
      "Jabuti na Lei",
      "Burocracia a Jato",
    ],
    description:
      "A oposição conseguiu adicionar uma cláusula que torna a lei aprovada na rodada anterior inviável, ela é anulada. O burocrata responsável será punido com um cargo no ministério.",
    type: CrisisType.PUBLICA,
  },
  VETO_DO_STF: {
    titles: ["Veto do STF", "Xandão Mandou", "São 3 Poderes, Não 2"],
    description:
      "O Supremo Tribunal Federal anulou a lei aprovada na rodada anterior. 'A justiça tarda, mas não falha.'",
    type: CrisisType.PUBLICA,
  },
  DELACAO_PREMIADA: {
    titles: ["Delação Premiada", "Cagueta", "X9"],
    description:
      "O Presidente pode escolher um jogador para revelar sua facção para todos. 'A verdade é uma arma poderosa.'",
    type: CrisisType.PUBLICA,
  },
  MENSAGEM_ANONIMA: {
    titles: ["Mensagem Anônima", "E-mail Anônimo", "Beijos, Anônimo"],
    description:
      "O Presidente recebe uma mensagem anônima com informações sobre um jogador. Ele pode revelar ou não. 'A verdade é uma faca de dois gumes.'",
    type: CrisisType.OCULTA,
  },
  TUITACO: {
    titles: ["Tuitaço", "Fake News", "Pablo Marçal"],
    description:
      "Alguém twittou um exame toxicológico falso do Presidente. O presidente não pode votar nesta rodada pois está ocupado gravando stories para se defender. 'A verdade é relativa.'",
    type: CrisisType.PUBLICA,
  },
  RECONTAGEM_VOTOS: {
    titles: ["Recontagem de Votos", "Voto Impresso Já!", "Eleição Roubada"],
    description:
      "Os poderosos não gostaram do resultado da última votação e ao recontar os votos, um deles desapareceu misteriosamente. A lei aprovada na rodada anterior é anulada.",
    type: CrisisType.PUBLICA,
  },
  CENSURA_ESTATAL: {
    titles: ["Censura Estatal", "Cala a Boca, Jornalista!"],
    description:
      "Um decreto emergencial proibiu certas informações de serem divulgadas. O Dossiê não pode ser passado nesta rodada. 'A verdade é perigosa.'",
    type: CrisisType.OCULTA,
  },
  PACOTE_DE_LEIS: {
    titles: ["Pacote de Leis", "O Centrão é Que Manda", "Toma Lá, Dá Cá"],
    description:
      "Se o presidente aprovar uma lei progressista, uma lei conservadora passará junto. 'A política é a arte do possível.'",
    type: CrisisType.PUBLICA,
  },
  VOTO_DE_MINERVA: {
    titles: ["Voto de Minerva", "Canetada Suprema", "Poder ModeradJor", "A Mão Invisível (do Presidente)"],
    description:
      "Em caso de empate, o presidente decide o resultado da votação. 'A decisão final é minha.'",
    type: CrisisType.PUBLICA,
  },
  FRAUDE_ELEITORAL: {
    titles: [
      "Fraude Eleitoral",
      "Urna Eletrônica Hackeada",
      "Democracia Burguesa",
    ],
    description:
      "Os conservadores têm seus votos duplicados nesta rodada. 'A democracia parece melhor quando se tem dinheiro.'",
    type: CrisisType.PUBLICA,
  },
} 


export default CRISES;
