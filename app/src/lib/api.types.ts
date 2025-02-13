export type UserDTO = {
  id: string;
  name: string;
  isHost: boolean;
  isConnected: boolean;
};

export type LawType = 'PROGRESSIVE' | 'CONSERVATIVE';

export type LawDTO = {
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
  LEGISLATIVE = 'LEGISLATIVE',
  IMPEACHMENT = 'IMPEACHMENT',
  CRISIS = 'CRISIS',
  REPORT_DOSSIER = 'REPORT_DOSSIER',
  SABOTAGE = 'SABOTAGE',
  RADICALIZATION = 'RADICALIZATION',
}

export enum LegislativeAction {
  DRAW_LAWS = 'DRAW_LAWS',
  VETO_LAW = 'VETO_LAW',
  CHOOSE_LAW_FOR_VOTING = 'CHOOSE_LAW_FOR_VOTING',
  START_VOTING = 'START_VOTING',
  VOTING = 'VOTING',
  ADVANCE_STAGE = 'ADVANCE_STAGE',
}

export type LegislativeStageDTO = {
  currentAction: LegislativeAction;
  drawnLaws: LawDTO[];
  isComplete: boolean;
  isVotingSecret: boolean;
  mustVeto: boolean;
  type: StageType.LEGISLATIVE;
  vetoableLaws: LawDTO[];
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
