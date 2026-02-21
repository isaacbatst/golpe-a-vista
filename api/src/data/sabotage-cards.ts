import { SabotageCardControlledBy } from 'src/domain/sabotage-card/sabotage-card-controlled-by';
import { SABOTAGE_CARD_NAMES } from '../domain/sabotage-card/sabotage-card-names';
import { SabotageCardVisibleTo } from '../domain/sabotage-card/sabotage-card-visible-to';

const SABOTAGE_CARDS: Record<
  SABOTAGE_CARD_NAMES,
  {
    name: SABOTAGE_CARD_NAMES;
    titles: string[];
    description: string;
    visibleTo?: SabotageCardVisibleTo[];
    notVisibleTo?: SabotageCardVisibleTo[];
    controlledBy: SabotageCardControlledBy[];
  }
> = {
  PLANO_COHEN: {
    name: SABOTAGE_CARD_NAMES.PLANO_COHEN,
    titles: ['Plano Cohen', 'Dossiê Fake do PCC', 'Arquivo Secreto da CPI'],
    description:
      "O Presidente descobre que o Dossiê dessa rodada contém informação falsificada. 'A verdade é um campo de batalha.'",
    visibleTo: [SabotageCardVisibleTo.PRESIDENT],
    controlledBy: [SabotageCardControlledBy.PRESIDENT],
  },
  MENSALAO: {
    name: SABOTAGE_CARD_NAMES.MENSALAO,
    titles: ['Mensalão', 'Caixa 2', 'Propina', 'Dinheiro na Mão...'],
    description:
      "O Golpista forçará três jogadores a votarem como ele. 'Democracia é bom, mas dinheiro é melhor.'",
    visibleTo: [SabotageCardVisibleTo.CONSERVATIVES],
    controlledBy: [
      SabotageCardControlledBy.SABOTEUR,
      SabotageCardControlledBy.CONSERVATIVE,
    ],
  },
  CAFE_COM_A_ABIN: {
    name: SABOTAGE_CARD_NAMES.CAFE_COM_A_ABIN,
    titles: [
      'Café com a ABIN',
      'Visita do FBI',
      'Papo Reto com a Inteligência',
      'Carro Preto na Porta',
      'MIB',
    ],
    description:
      'O Relator do Dossiê não receberá o Dossiê desta rodada. Após um encontrão com um agente secreto, ele misteriosamente não se lembra de nada.',
    visibleTo: [SabotageCardVisibleTo.RAPPORTEUR],
    controlledBy: [SabotageCardControlledBy.RAPPORTEUR],
  },
  // OPERACAO_MAOS_LIMPAS: {
  //   titles: [
  //     "Operação Mãos Limpas",
  //     "Caixa Preta da República",
  //     "Relatório da Receita Federal",
  //   ],
  //   description:
  //     "O Presidente recebe um relatório indicando qual foi a lei vetada na rodada anterior. 'A questão é: será que ele consegue provar?'",
  //   visibleTo: [SabotageCardVisibleTo.PRESIDENT],
  // },
  O_FMI_MANDOU: {
    name: SABOTAGE_CARD_NAMES.O_FMI_MANDOU,
    titles: ['O FMI Mandou', 'O Dolár Subiu', 'A Bolsa Caiu'],
    description:
      "O Presidente deve vetar uma lei progressista, se houver. Um famoso editorial disse que 'o mercado não gostou', e agora não há mais o que fazer.",
    visibleTo: [SabotageCardVisibleTo.PRESIDENT],
    controlledBy: [SabotageCardControlledBy.PRESIDENT],
  },
  FORCAS_OCULTAS: {
    name: SABOTAGE_CARD_NAMES.FORCAS_OCULTAS,
    titles: [
      'Forças Ocultas',
      'Illuminati Confirmed',
      'Os Rothschild Intervêm',
      'Reptilianos no Poder',
      'Nova Ordem Mundial Assume!',
      'Anunnakis no Planalto',
    ],
    description:
      "O Presidente é obrigado a vetar uma lei progressista. '[...] As forças e os interesses contra o povo coordenaram-se novamente e se desencadeiam sobre mim.'",
    visibleTo: [SabotageCardVisibleTo.PRESIDENT],
    controlledBy: [SabotageCardControlledBy.PRESIDENT],
  },
  // REGIME_DE_URGENCIA: {
  //   titles: ["Regime de Urgência", "Votação Relâmpago", "PEC da Madrugada"],
  //   description:
  //     "Um setor se articulou para apressar a votação e agora o Presidente deve vetar uma lei e escolher outra em 5 segundos, ou a primeira da pilha será aprovada. Os outros jogadores têm 5 segundos para votar, ou será aprovada automaticamente, já que 'os políticos trabalham rápido quando convém'.",
  //   visibleTo: [SabotageCardVisibleTo.ALL],
  // },
  SESSAO_SECRETA: {
    name: SABOTAGE_CARD_NAMES.SESSAO_SECRETA,
    titles: ['Sessão Secreta', 'O Que Os Olhos Não Veem...'],
    description:
      "A votação desta rodada é feita secretamente. 'Foi tudo resolvido em uma reunião discreta na calada da noite.'",
    visibleTo: [SabotageCardVisibleTo.ALL],
    controlledBy: [SabotageCardControlledBy.PRESIDENT],
  },
  GOLPE_DE_ESTADO: {
    name: SABOTAGE_CARD_NAMES.GOLPE_DE_ESTADO,
    titles: [
      'Golpe de Estado',
      'Pedalada Fiscal',
      'Tudo por um Fiat Elba...',
      'Lava Jato',
    ],
    description:
      "O presidente foi pego com a boca na butija, a presidencia é passada para o próximo jogador na ordem de jogo. 'Agora sim, o Brasil vai pra frente!'",
    visibleTo: [SabotageCardVisibleTo.ALL],
    controlledBy: [SabotageCardControlledBy.PRESIDENT],
  },
  // VAZAMENTO_NO_WIKILEAKS: {
  //   titles: ["Vazamento no WikiLeaks", "Snowden Contra-Ataca", "Vaza Jato"],
  //   description:
  //     "Informações sigilosas foram disponibilizadas na internet. Todos verão a lei que foi vetada na rodada anterior. 'Bem-vindo à era da informação.'",
  //   visibleTo: [SabotageCardVisibleTo.ALL],
  // },
  CONGRESSO_TRANCADO: {
    name: SABOTAGE_CARD_NAMES.CONGRESSO_TRANCADO,
    titles: [
      'Congresso Trancado',
      'Obstrução Parlamentar',
      'Congresso Travado',
    ],
    description:
      "O Presidente não pode vetar uma lei conservadora nesta rodada, pois a oposição trancou a pauta e quer empurrar a lei goela abaixo.'",
    visibleTo: [SabotageCardVisibleTo.ALL],
    controlledBy: [SabotageCardControlledBy.PRESIDENT],
  },
  PEGADINHA_DO_PARAGRAFO_47_INCISO_V: {
    name: SABOTAGE_CARD_NAMES.PEGADINHA_DO_PARAGRAFO_47_INCISO_V,
    titles: [
      'Pegadinha do Parágrafo 47 Inciso V',
      'Jabuti na Lei',
      'Burocracia a Jato',
    ],
    description:
      'A oposição conseguiu adicionar uma cláusula que torna a ultima lei progressista aprovada inviável. O burocrata responsável será punido com um cargo no ministério.',
    visibleTo: [SabotageCardVisibleTo.ALL],
    controlledBy: [SabotageCardControlledBy.PRESIDENT],
  },
  VETO_DO_STF: {
    name: SABOTAGE_CARD_NAMES.VETO_DO_STF,
    titles: ['Veto do STF', 'Xandão Mandou', 'São 3 Poderes, Não 2'],
    description:
      "O Supremo Tribunal Federal anulou a lei aprovada na rodada anterior. 'A justiça tarda, mas não falha.'",
    visibleTo: [SabotageCardVisibleTo.ALL],
    controlledBy: [SabotageCardControlledBy.PRESIDENT],
  },
  // DELACAO_PREMIADA: {
  //   titles: ["Delação Premiada", "Cagueta", "X9"],
  //   description:
  //     "O Presidente pode escolher um jogador para revelar sua facção para todos. 'A verdade é uma arma poderosa.'",
  //   visibleTo: [SabotageCardVisibleTo.ALL],
  // },
  // MENSAGEM_ANONIMA: {
  //   titles: ["Mensagem Anônima", "E-mail Anônimo", "Beijos, Anônimo"],
  //   description:
  //     "O Presidente recebe uma mensagem anônima com informações sobre um jogador. Ele pode revelar ou não. 'A verdade é uma faca de dois gumes.'",
  //   visibleTo: [SabotageCardVisibleTo.PRESIDENT],
  // },
  // TUITACO: {
  //   titles: ["Tuitaço", "Fake News", "Pablo Marçal"],
  //   description:
  //     "Alguém twittou um exame toxicológico falso do Presidente. O presidente não pode votar nesta rodada pois está ocupado gravando stories para se defender. 'A verdade é relativa.'",
  //   visibleTo: [SabotageCardVisibleTo.ALL],
  // },
  // RECONTAGEM_VOTOS: {
  //   titles: ["Recontagem de Votos", "Voto Impresso Já!", "Eleição Roubada"],
  //   description:
  //     "Os poderosos não gostaram do resultado da última votação e ao recontar os votos, um deles desapareceu misteriosamente. A lei aprovada na rodada anterior é anulada.",
  //   visibleTo: [SabotageCardVisibleTo.ALL],
  // },
  // CENSURA_ESTATAL: {
  //   titles: ["Censura Estatal", "Cala a Boca, Jornalista!"],
  //   description:
  //     "Um decreto emergencial proibiu certas informações de serem divulgadas. O Dossiê não pode ser passado nesta rodada. 'A verdade é perigosa.'",
  //   visibleTo: [SabotageCardVisibleTo.PRESIDENT],
  // },
  // PACOTE_DE_LEIS: {
  //   titles: ["Pacote de Leis", "O Centrão é Que Manda", "Toma Lá, Dá Cá"],
  //   description:
  //     "Se o presidente aprovar uma lei progressista, uma lei conservadora passará junto. 'A política é a arte do possível.'",
  //   visibleTo: [SabotageCardVisibleTo.ALL],
  // },
  // VOTO_DE_MINERVA: {
  //   titles: ["Voto de Minerva", "Canetada Suprema", "Poder ModeradJor", "A Mão Invisível (do Presidente)"],
  //   description:
  //     "Em caso de empate, o presidente decide o resultado da votação. 'A decisão final é minha.'",
  //   visibleTo: [SabotageCardVisibleTo.ALL],
  // },
  // FRAUDE_ELEITORAL: {
  //   titles: [
  //     "Fraude Eleitoral",
  //     "Urna Eletrônica Hackeada",
  //     "Democracia Burguesa",
  //   ],
  //   description:
  //     "Os conservadores têm seus votos duplicados nesta rodada. 'A democracia parece melhor quando se tem dinheiro.'",
  //   visibleTo: [SabotageCardVisibleTo.ALL],
  // },
};

export default SABOTAGE_CARDS;
