import CRISES from "../data/crises";
import { Law, LAWS } from "../data/laws";
import { Crisis } from "./crisis";
import { Deck } from "./deck";
import { Either, left, right } from "./either";
import { Player } from "./player";
import { Random } from "./random";
import { LawType, Role } from "./role";
import { Round } from "./round";

type GameParams = {
  players: string[];
  lawsToProgressiveWin?: number;
  lawsToConservativeWin?: number;
  minConservativeLawsToImpeach?: number;
  crisesIntervalToImpeach?: number;
  laws?: Law[];
  roles?: Role[];
  crises?: Crisis[];
  progressiveLawsToCrisis?: number;
};

export class Game {
  private static readonly ROLES_DISTRIBUTION = [
    Role.RADICAL,
    Role.MODERADO,
    Role.MODERADO,
    Role.MODERADO,
    Role.CONSERVADOR,
    Role.CONSERVADOR,
  ];

  private _players: Player[] = [];
  private _lawsDeck: Deck<Law>;
  private _approvedLaws: Law[] = [];
  private _lawsToProgressiveWin: number;
  private _lawsToConservativeWin: number;
  private _minConservativeLawsToImpeach: number;
  private _crisesIntervalToImpeach: number;
  private _presidentQueue: Player[];
  private _rounds: Round[] = [];
  private _roles: Role[];
  private _crisesDeck: Deck<Crisis>;
  private _progressiveLawsToCrisis;

  static create(props: GameParams): Either<string, Game> {
    const {
      players,
      laws,
      crises,
      roles = [...Game.ROLES_DISTRIBUTION],
      lawsToProgressiveWin = 6,
      lawsToConservativeWin = 7,
      minConservativeLawsToImpeach = 5,
      crisesIntervalToImpeach = 3,
      progressiveLawsToCrisis: progressiveLawsToCrisis = 2,
    } = props;

    const [errorLawsDeckCreate, lawsDeck] = Deck.create(laws ?? LAWS);
    if (!lawsDeck) {
      return left(errorLawsDeckCreate);
    }
    const [errorCrisesDeckCreate, crisesDeck] = Deck.create(
      crises ??
        Object.values(CRISES).map(
          (crisis) => new Crisis(crisis.titles, crisis.description, crisis.type)
        )
    );

    if (!crisesDeck) {
      return left(errorCrisesDeckCreate);
    }

    return right(
      new Game(
        players,
        lawsDeck,
        lawsToProgressiveWin,
        lawsToConservativeWin,
        roles,
        crisesDeck,
        minConservativeLawsToImpeach,
        crisesIntervalToImpeach,
        progressiveLawsToCrisis
      )
    );
  }

  private constructor(
    players: string[],
    lawsDeck: Deck<Law>,
    lawsToProgressiveWin: number,
    lawsToConservativeWin: number,
    roles: Role[],
    crisesDeck: Deck<Crisis>,
    minConservativeLawsToImpeach: number,
    crisesIntervalToImpeach: number,
    progressiveLawsIntervalToCrisis: number
  ) {
    players.forEach((playerName) => {
      const role = Random.extractFromArray(roles);
      const player = new Player(playerName, role);
      this._players.push(player);
    });
    this._roles = roles;
    this._lawsDeck = lawsDeck;
    this._lawsToProgressiveWin = lawsToProgressiveWin;
    this._lawsToConservativeWin = lawsToConservativeWin;
    this._minConservativeLawsToImpeach = minConservativeLawsToImpeach;
    this._crisesIntervalToImpeach = crisesIntervalToImpeach;
    this._presidentQueue = [...Random.sort(this._players)];
    this._crisesDeck = crisesDeck;
    this._progressiveLawsToCrisis = progressiveLawsIntervalToCrisis;
    this._rounds.push(
      new Round({
        president: this._presidentQueue[0],
        lawsDeck: this._lawsDeck,
        crisesDeck: this._crisesDeck,
      })
    );
  }

  nextRound() {
    this._rounds.push(
      new Round({
        president: this.getPresidentFromQueue(this._rounds.length),
        lawsDeck: this._lawsDeck,
        crisesDeck: this._crisesDeck,
        rapporteur: this.currentRound.nextRapporteur,
        crisis: this.nextRoundCrisis,
        hasImpeachment: this.nextRoundShouldImpeach,
      })
    );
  }

  drawLaws(): Law[] {
    return this.currentRound.drawLaws();
  }

  chooseLaw(index: number) {
    this.currentRound.chooseLaw(index);
  }

  startVoting() {
    return this.currentRound.startVoting(
      this._players.map((player) => player.name)
    );
  }

  canVote(playerName: string) {
    const player = this.players.find((player) => player.name === playerName);
    return player ? !player.impeached : false;
  }

  vote(playerName: string, vote: boolean) {
    if (!this.canVote(playerName)) {
      return left("Jogador não pode votar");
    }
    return this.currentRound.vote(playerName, vote);
  }

  endVoting(): Either<string, boolean> {
    const [error, law] = this.currentRound.endVoting();
    if (error) {
      return left(error);
    }

    if (law) {
      this._approvedLaws.push(law);
    } else {
      this.currentRound.nextShouldHaveCrisisPerRejectedLaw = true;
    }

    return right(law !== null);
  }

  chooseDossierRapporteur(player: Player): Either<string, void> {
    if (this.president === player) {
      return left("O presidente não pode ser o relator");
    }

    const nextPresident = this.getPresidentFromQueue(
      this.currentRoundIndex + 1
    );
    if (nextPresident === player) {
      return left("O próximo presidente não pode ser o relator");
    }

    if (this.hasBeenRapporteur(player)) {
      return left("O relator não pode ser escolhido duas vezes seguidas");
    }

    if (player.impeached) {
      return left("O relator não pode ter sido cassado");
    }

    this.currentRound.setNextRapporteur(player);

    return right();
  }

  canSabotage(): Either<string, boolean> {
    const [canSabotageError] = this.currentRound.canSabotage();

    if(canSabotageError) {
      return left(canSabotageError);
    }

    if (this._rounds.length < 2) {
      return this.currentRound.canSabotage();
    }

    const previousRound = this._rounds[this._rounds.length - 2];
    if(previousRound.sabotageCrisis){
      return left("Não é possível sabotar duas vezes seguidas");
    }

    return right(true);
  }

  sabotage() {
    const [canSabotageError] = this.canSabotage();
    if (canSabotageError) {
      return left(canSabotageError);
    }

    return this.currentRound.sabotage();
  }

  chooseSabotageCrisis(index: number) {
    return this.currentRound.chooseSabotageCrisis(index);
  }

  impeach(player: Player): Either<string, void> {
    return this.currentRound.impeach(player);
  }

  getPresidentFromQueue(round: number) {
    return this._presidentQueue.filter((p) => !p.impeached)[
      round % this._presidentQueue.length
    ];
  }

  get nextRoundShouldImpeach() {
    const conservativeLaws = this._approvedLaws.filter(
      (law) => law.type === LawType.CONSERVADORES
    );

    const hasApprovedConservativeLaw = Boolean(
      this.currentRound.lawToVote?.type === LawType.CONSERVADORES &&
        this.currentRound.votingResult
    );

    if (
      conservativeLaws.length >= this._minConservativeLawsToImpeach &&
      hasApprovedConservativeLaw
    ) {
      return true;
    }

    const crisesCount = this._rounds.filter((round) => round.crisis).length;
    if (crisesCount > 0 && crisesCount % this._crisesIntervalToImpeach === 0) {
      return true;
    }
  }

  get nextRoundCrisis() {
    if (this.currentRound.sabotageCrisis) {
      return this.currentRound.sabotageCrisis;
    }

    if (
      this.currentRound.nextShouldHaveCrisisPerRejectedLaw ||
      this.nextShouldHaveCrisisPerModerateFear
    ) {
      return this._crisesDeck.draw(1)[0];
    }

    return null;
  }

  get nextShouldHaveCrisisPerModerateFear() {
    const lastLaws = this._approvedLaws.slice(-this._progressiveLawsToCrisis);
    const areLastLawsProgressive = lastLaws.every(
      (law) => law.type === LawType.PROGRESSISTAS
    );

    return (
      lastLaws.length >= this._progressiveLawsToCrisis &&
      areLastLawsProgressive &&
      this.president.role === Role.MODERADO &&
      this.currentRound.lawToVote?.type === LawType.PROGRESSISTAS &&
      this.currentRound.votingResult
    );
  }

  get hasProgressiveWon() {
    const everyConservativeIsImpeached = this._players
      .filter((player) => player.role === Role.CONSERVADOR)
      .every((player) => player.impeached);
    return (
      this._approvedLaws.filter((law) => law.type === LawType.PROGRESSISTAS)
        .length >= this._lawsToProgressiveWin || everyConservativeIsImpeached
    );
  }

  get hasConservativeWon() {
    const everyRadicalIsImpeached = this._players
      .filter((player) => player.role === Role.RADICAL)
      .every((player) => player.impeached);

    return (
      this._approvedLaws.filter((law) => law.type === LawType.CONSERVADORES)
        .length >= this._lawsToConservativeWin || everyRadicalIsImpeached
    );
  }

  get winner() {
    if (this.hasProgressiveWon) {
      return LawType.PROGRESSISTAS;
    }

    if (this.hasConservativeWon) {
      return LawType.CONSERVADORES;
    }

    return null;
  }

  get isFinished() {
    return Boolean(this.winner);
  }

  get roles() {
    return [...this._roles];
  }

  get currentRound() {
    return this._rounds[this._rounds.length - 1];
  }

  get currentRoundIndex() {
    return this._rounds.length - 1;
  }

  get votingHistory() {
    return [...this._rounds.map((round) => round.voting)];
  }

  get approvedLaws() {
    return [...this._approvedLaws];
  }

  get president() {
    return this.currentRound.president;
  }

  get presidentQueue() {
    return [...this._presidentQueue];
  }

  get players() {
    return [...this._players];
  }

  get rapporteur() {
    return this.currentRound.rapporteur;
  }

  get minConservativeLawsToImpeach() {
    return this._minConservativeLawsToImpeach;
  }

  get crisesIntervalToImpeach() {
    return this._crisesIntervalToImpeach;
  }

  private hasBeenRapporteur(player: Player): boolean {
    return this._rounds.some((round) => round.rapporteur === player);
  }
}
