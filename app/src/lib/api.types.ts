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

export type CrisisDTO = {
  title: string;
  description: string;
  visibleTo: string[];
  notVisibleTo: string[];
  currentAction: string;
  isComplete: boolean;
  actions: string;
};

export type PlayerDTO = {
  id: string;
  name: string;
  role: string;
  impeached: boolean;
  radicalized: boolean;
  isPresident: boolean;
  isRapporteur: boolean;
  isNextPresident: boolean;
  canSeeTeamMembers: boolean;
};

export enum StageType {
  LEGISLATIVE = "LEGISLATIVE",
  IMPEACHMENT = "IMPEACHMENT",
  CRISIS = "CRISIS",
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

export type Voting = {
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
};

export type LegislativeStageLawDTO = LawDTO & {
  isVetoable: boolean;
  isVetoed: boolean;
  isLawToVote: boolean | null;
};

export type LegislativeStageDTO = {
  currentAction: LegislativeAction;
  drawnLaws: LegislativeStageLawDTO[];
  isComplete: boolean;
  isVotingSecret: boolean;
  mustVeto: boolean;
  type: StageType.LEGISLATIVE;
  vetoableLaws: LawDTO[];
  voting: Voting | null;
};

export type StageDTO = LegislativeStageDTO;

export type RoundDTO = {
  index: number;
  stages: StageDTO[];
  isDossierFake: boolean;
  isDossierOmitted: boolean;
  isLegislativeVotingSecret: boolean;
  requiredVeto: LawType | null;
  hasImpeachment: boolean;
  president: PlayerDTO;
  nextPresident: PlayerDTO;
  finished: boolean;
  currentStage: StageDTO;
};

export type GameDTO = {
  players: PlayerDTO[];
  lawsDeck: LawDTO[];
  crisesDeck: CrisisDTO[];
  president: UserDTO;
  winner: UserDTO | null;
  lawsToProgressiveWin: number;
  lawsToConservativeWin: number;
  crisesIntervalToImpeach: number;
  rounds: RoundDTO[];
  currentRoundIndex: number;
  currentRound: RoundDTO;
  progressiveLawsToFear: number;
  rejectedLawsIntervalToCrisis: number;
  conservativesImpeachedToRadicalWin: number;
  approvedConservativeLaws: number;
  approvedProgressiveLaws: number;
};

export type LobbyDTO = {
  users: UserDTO[];
  id: string;
  minPlayers: number;
  currentGame: GameDTO;
};
