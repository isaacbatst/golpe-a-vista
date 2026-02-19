export type UserDTO = {
  id: string;
  name: string;
  isHost: boolean;
  isConnected: boolean;
};

export enum LawType {
  CONSERVADORES = "Conservadores",
  PROGRESSISTAS = "Progressistas",
}

export type LawDTO = {
  id: string;
  name: string;
  type: LawType;
  description: string;
};

export enum CrisisVisibleTo {
  ALL = "Todos",
  PRESIDENT = "Presidente",
  RAPPORTEUR = "Relator",
}

export type CrisisDTO = {
  name: string;
  title: string;
  description: string;
  visibleTo: CrisisVisibleTo[];
  notVisibleTo: string[];
  currentAction: string;
  isComplete: boolean;
  actions: string[];
};

export enum Role {
  RADICAL = "Radical",
  MODERADO = "Moderado",
  CONSERVADOR = "Conservador",
}

export type PlayerDTO = {
  id: string;
  name: string;
  role: Role;
  impeached: boolean;
  radicalized: boolean;
  isPresident: boolean;
  isRapporteur: boolean;
  isNextPresident: boolean;
  canSeeTeamMembers: boolean;
  canBeRapporteur:
    | {
        status: true;
        reason: undefined;
      }
    | {
        status: false;
        reason: string;
      };
};

export enum StageType {
  IMPEACHMENT = "IMPEACHMENT",
  CRISIS = "CRISIS",
  LEGISLATIVE = "LEGISLATIVE",
  REPORT_DOSSIER = "REPORT_DOSSIER",
  SABOTAGE = "SABOTAGE",
  RADICALIZATION = "RADICALIZATION",
}

export enum LegislativeAction {
  DRAW_LAWS = "DRAW_LAWS",
  VETO_LAW = "VETO_LAW",
  CHOOSE_LAW_FOR_VOTING = "CHOOSE_LAW_FOR_VOTING",
  START_VOTING = "START_VOTING",
  VOTING = "VOTING",
  ADVANCE_STAGE = "ADVANCE_STAGE",
}

export enum DossierAction {
  SELECT_RAPPORTEUR = "SELECT_RAPPORTEUR",
  PASS_DOSSIER = "PASS_DOSSIER",
  ADVANCE_STAGE = "ADVANCE_STAGE",
}

export type VotingDTO = {
  count: {
    yes: number;
    no: number;
    abstention: number;
  };
  result: boolean | null;
  votes: Array<{
    player: string;
    vote: boolean | null;
  }>;
  hasEnded: boolean;
};

export type LegislativeProposalDTO = {
  law: LawDTO;
  isVetoable: boolean;
  isVetoed: boolean;
  isChosenForVoting: boolean | null;
};

export type LegislativeStageDTO = {
  currentAction: LegislativeAction;
  proposals: LegislativeProposalDTO[];
  notVetoableProposals: {
    id: string;
    reason: string;
  }[];
  isComplete: boolean;
  isVotingSecret: boolean;
  mustVeto: boolean;
  type: StageType.LEGISLATIVE;
  vetoableLaws: LawDTO[];
  voting: VotingDTO | null;
  lawToVote: LegislativeProposalDTO | null;
  isLawToVoteVisible: boolean;
};

export type DossierStageDTO = {
  currentAction: DossierAction;
  type: StageType.REPORT_DOSSIER;
  dossier: LawDTO[];
};

export enum SabotageAction {
  SABOTAGE_OR_SKIP = "SABOTAGE_OR_SKIP",
  DRAW_CRISIS = "DRAW_CRISIS",
  CHOOSE_CRISIS = "CHOOSE_CRISIS",
  ADVANCE_STAGE = "ADVANCE_STAGE",
}

export type SabotageStageDTO = {
  currentAction: SabotageAction;
  type: StageType.SABOTAGE;
  drawnCrises: CrisisDTO[];
  selectedCrisis: CrisisDTO | null;
};

export enum CrisisStageAction {
  START_CRISIS = "START_CRISIS",
  ADVANCE_STAGE = "ADVANCE_STAGE",
}

export enum CRISIS_NAMES {
  PLANO_COHEN = "PLANO_COHEN",
  MENSALAO = "MENSALAO",
  CAFE_COM_A_ABIN = "CAFE_COM_A_ABIN",
  // OPERACAO_MAOS_LIMPAS = "OPERACAO_MAOS_LIMPAS",
  O_FMI_MANDOU = "O_FMI_MANDOU",
  FORCAS_OCULTAS = "FORCAS_OCULTAS",
  // REGIME_DE_URGENCIA = "REGIME_DE_URGENCIA",
  SESSAO_SECRETA = "SESSAO_SECRETA",
  GOLPE_DE_ESTADO = "GOLPE_DE_ESTADO",
  // VAZAMENTO_NO_WIKILEAKS = "VAZAMENTO_NO_WIKILEAKS",
  // CONGRESSO_TRANCADO = "CONGRESSO_TRANCADO",
  // PEGADINHA_DO_PARAGRAFO_47_INCISO_V = "PEGADINHA_DO_PARAGRAFO_47_INCISO_V",
  // VETO_DO_STF = "VETO_DO_STF",
  // DELACAO_PREMIADA = "DELACAO_PREMIADA",
  // MENSAGEM_ANONIMA = "MENSAGEM_ANONIMA",
  // TUITACO = "TUITACO",
  // RECONTAGEM_VOTOS = "RECONTAGEM_VOTOS",
  // CENSURA_ESTATAL = "CENSURA_ESTATAL",
  // PACOTE_DE_LEIS = "PACOTE_DE_LEIS",
  // VOTO_DE_MINERVA = "VOTO_DE_MINERVA",
  // FRAUDE_ELEITORAL = "FRAUDE_ELEITORAL",
}

export enum MensalaoAction {
  SET_MIRROR_ID = "SET_MIRROR_ID",
  CHOOSE_PLAYER = "CHOOSE_PLAYER",
  ADVANCE_STAGE = "ADVANCE_STAGE",
}

export type MensalaoDTO = {
  isComplete: boolean;
  currentAction: MensalaoAction;
  actions: MensalaoAction[];
  crisis: CRISIS_NAMES.MENSALAO;
  chosenPlayers: string[];
  mirrorId: string | null;
  maxSelectedPlayers: number;
  timeToAdvance: number;
};

export type AutomaticEffectDTO = {
  isComplete: boolean;
  currentAction: string;
  actions: string[];
  crisis: Exclude<CRISIS_NAMES, CRISIS_NAMES.MENSALAO>;
  timeToAdvance: number;
};

export type CrisisEffectDTO = MensalaoDTO | AutomaticEffectDTO;

export type CrisisStageDTO = {
  currentAction: CrisisStageAction;
  type: StageType.CRISIS;
  crisis: CrisisDTO | null;
  crisisEffect: CrisisEffectDTO | null;
};

export enum RadicalizationAction {
  RADICALIZE = "RADICALIZE",
  ADVANCE_STAGE = "ADVANCE_STAGE",
}

export type RadicalizationStageDTO = {
  currentAction: RadicalizationAction;
  type: StageType.RADICALIZATION;
  targetId: string | null;
};

export enum ImpeachmentAction {
  SELECT_TARGET = "SELECT_TARGET",
  START_VOTING = "START_VOTING",
  VOTING = "VOTING",
  EXECUTION = "EXECUTION",
  ADVANCE_STAGE = "ADVANCE_STAGE",
}

export type ImpeachmentStageDTO = {
  currentAction: ImpeachmentAction;
  type: StageType.IMPEACHMENT;
  targetId: string | null;
  targetRole: Role | null;
  voting: VotingDTO | null;
};

export type StageDTO =
  | LegislativeStageDTO
  | DossierStageDTO
  | SabotageStageDTO
  | CrisisStageDTO
  | RadicalizationStageDTO
  | ImpeachmentStageDTO;

export type RoundDTO = {
  index: number;
  stages: StageDTO[];
  isDossierFake: boolean;
  isDossierOmitted: boolean;
  isLegislativeVotingSecret: boolean;
  requiredVeto: LawType | null;
  hasImpeachment: boolean;
  presidentId: string;
  nextPresidentId: string;
  finished: boolean;
  currentStage: StageDTO;
  rapporteur: string | null;
  hasLastRoundBeenSabotaged: boolean;
  mirroedVotes: [string, string][];
};

export type GameDTO = {
  players: PlayerDTO[];
  lawsDeck: LawDTO[];
  crisesDeck: CrisisDTO[];
  president: UserDTO;
  nextPresident: UserDTO;
  winner: Role | null;
  winnerWinConditions:
    | {
        isFulfilled: boolean;
        message: string;
      }[]
    | null;
  lawsToProgressiveWin: number;
  lawsToConservativeWin: number;
  crisesIntervalToImpeach: number;
  rounds: RoundDTO[];
  currentRound: RoundDTO;
  progressiveLawsToFear: number;
  rejectedLawsIntervalToCrisis: number;
  conservativesImpeachedToRadicalWin: number;
  approvedConservativeLaws: LawDTO[];
  approvedProgressiveLaws: LawDTO[];
  crisisControlledBy: string | null;
  presidentQueue: {
    players: string[];
    offset: number;
  };
};

export type LobbyDTO = {
  users: UserDTO[];
  id: string;
  minPlayers: number;
  currentGame: GameDTO;
};
