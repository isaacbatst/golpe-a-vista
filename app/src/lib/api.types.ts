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
  name: string;
  title: string;
  description: string;
  visibleTo: string[];
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
  saboteur: boolean;
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
  voting: VotingDTO | null;
  lawToVote: LegislativeStageLawDTO | null;
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
  drawnCrises: CrisisDTO[]
  selectedCrisis: CrisisDTO | null;
};

export type StageDTO = LegislativeStageDTO | DossierStageDTO | SabotageStageDTO;

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
  rapporteur: string | null;
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
  approvedConservativeLaws: LawDTO[];
  approvedProgressiveLaws: LawDTO[];
};

export type LobbyDTO = {
  users: UserDTO[];
  id: string;
  minPlayers: number;
  currentGame: GameDTO;
};
