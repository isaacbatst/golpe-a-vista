import { Law } from "../data/laws";
import { Crisis } from "./crisis/crisis";
import { Deck } from "./deck";
import { Either, left, right } from "./either";
import { Player } from "./player";
import { PresidentQueue } from "./president-queue";
import { Random } from "./random";
import { LawType, Role } from "./role";
import { Round } from "./round";

type GameParams = {
  players: Player[];
  lawsToProgressiveWin?: number;
  lawsToConservativeWin?: number;
  crisesIntervalToImpeach?: number;
  crisesDeck: Deck<Crisis>;
  lawsDeck: Deck<Law>;
  minProgressiveLawsToFearCrisis?: number;
  rounds?: Round[];
  rejectedLawsIntervalToCrisis?: number;
  presidentQueue?: Player[];
  conservativesImpeachedToRadicalWin?: number;
};

export class Game {
  static createPlayers(
    players: string[],
    roles: Role[] = Game.rolesByPlayersLength(players.length)
  ): Player[] {
    const rolesToDistribute = [...roles];
    return players.map((playerName) => {
      const role = Random.extractFromArray(rolesToDistribute);
      return new Player(playerName, role);
    });
  }

  static rolesByPlayersLength(length: number) {
    const map: Record<number, Role[]> = {
      6: [
        Role.RADICAL,
        Role.MODERADO,
        Role.MODERADO,
        Role.MODERADO,
        Role.CONSERVADOR,
        Role.CONSERVADOR,
      ],
    };

    const roles = map[length];
    if (!roles) {
      throw new Error("Quantidade de jogadores não suportada  ");
    }
    return roles;
  }

  private _players: Player[] = [];
  private _lawsDeck: Deck<Law>;
  private _lawsToProgressiveWin: number;
  private _lawsToConservativeWin: number;
  private _crisesIntervalToImpeach: number;
  private _presidentQueue: PresidentQueue;
  private _rounds: Round[];
  private _crisesDeck: Deck<Crisis>;
  private _progressiveLawsToFear;
  private _rejectedLawsIntervalToCrisis: number;
  private _conservativesImpeachedToRadicalWin: number;

  static create(props: GameParams): Either<string, Game> {
    const {
      players,
      lawsDeck,
      crisesDeck,
      lawsToProgressiveWin = 6,
      lawsToConservativeWin = 7,
      crisesIntervalToImpeach = 3,
      minProgressiveLawsToFearCrisis = 2,
      rejectedLawsIntervalToCrisis = 2,
      conservativesImpeachedToRadicalWin = 2,
    } = props;

    return right(
      new Game(
        players,
        lawsDeck,
        lawsToProgressiveWin,
        lawsToConservativeWin,
        crisesDeck,
        crisesIntervalToImpeach,
        minProgressiveLawsToFearCrisis,
        rejectedLawsIntervalToCrisis,
        conservativesImpeachedToRadicalWin,
        props.presidentQueue,
        props.rounds
      )
    );
  }

  private constructor(
    players: Player[],
    lawsDeck: Deck<Law>,
    lawsToProgressiveWin: number,
    lawsToConservativeWin: number,
    crisesDeck: Deck<Crisis>,
    crisesIntervalToImpeach: number,
    progressiveLawsIntervalToCrisis: number,
    rejectedLawsIntervalToCrisis: number,
    conservativesImpeachedToRadicalWin: number,
    presidentQueue?: Player[],
    rounds?: Round[]
  ) {
    this._players = players;
    this._lawsDeck = lawsDeck;
    this._lawsToProgressiveWin = lawsToProgressiveWin;
    this._lawsToConservativeWin = lawsToConservativeWin;
    this._crisesIntervalToImpeach = crisesIntervalToImpeach;
    this._presidentQueue = new PresidentQueue(
      presidentQueue ?? [...Random.sort(this._players)]
    );
    this._crisesDeck = crisesDeck;
    this._progressiveLawsToFear = progressiveLawsIntervalToCrisis;
    this._rejectedLawsIntervalToCrisis = rejectedLawsIntervalToCrisis;
    this._conservativesImpeachedToRadicalWin =
      conservativesImpeachedToRadicalWin;
    this._rounds = rounds ?? [
      new Round({
        president: this.getPresidentFromQueue(0),
        lawsDeck: this._lawsDeck,
        crisesDeck: this._crisesDeck,
        nextPresident: this.getPresidentFromQueue(1),
      }),
    ];
  }

  nextRound(): Either<string, Round> {
    if (!this.currentRound.finished) {
      return left("A rodada atual não foi finalizada");
    }

    let nextPresident = this._presidentQueue.getByRoundNumber(this._rounds.length);

    while(nextPresident.impeached){
      this._presidentQueue.shift();
      nextPresident = this._presidentQueue.getByRoundNumber(this._rounds.length);
    }

    const round = new Round({
      president: this.getPresidentFromQueue(this._rounds.length),
      lawsDeck: this._lawsDeck,
      crisesDeck: this._crisesDeck,
      crisis: this.nextRoundCrisis,
      hasImpeachment: this.nextRoundShouldImpeach,
      nextPresident: this.getPresidentFromQueue(this._rounds.length + 1),
      rapporteur: this.currentRound.nextRapporteur,
    });

    this._rounds.push(round);
    return right(round);
  }

  getPresidentFromQueue(round: number) {
    return this._presidentQueue.getByRoundNumber(round);
  }

  get nextRoundShouldImpeach() {
    if (this.currentRound.hasApprovedLaw(LawType.CONSERVADORES)) {
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
      this.nextShouldHaveCrisisPerRejectedLaws ||
      this.nextShouldHaveCrisisPerModerateFear
    ) {
      return this._crisesDeck.draw(1)[0];
    }

    return null;
  }

  get nextShouldHaveCrisisPerRejectedLaws() {
    return (
      this.rejectedLaws > 0 &&
      this.rejectedLaws % this._rejectedLawsIntervalToCrisis === 0
    );
  }

  get nextShouldHaveCrisisPerModerateFear() {
    const lastRounds = this._rounds.slice(-this._progressiveLawsToFear);
    const lastRoundsApprovedProgressiveLaws = lastRounds.every((round) =>
      round.hasApprovedLaw(LawType.PROGRESSISTAS)
    );

    return (
      this.president.role === Role.MODERADO &&
      this.currentRound.hasApprovedLaw(LawType.PROGRESSISTAS) &&
      lastRounds.length >= this._progressiveLawsToFear &&
      lastRoundsApprovedProgressiveLaws
    );
  }

  get hasModerateWon() {
    return (
      this.approvedLaws.filter((law) => law.type === LawType.PROGRESSISTAS)
        .length >= this._lawsToProgressiveWin
    );
  }

  get hasConservativeWon() {
    const areEveryRadicalImpeached = this._players
      .filter((player) => player.role === Role.RADICAL)
      .every((player) => player.impeached);

    return (
      this.approvedLaws.filter((law) => law.type === LawType.CONSERVADORES)
        .length >= this._lawsToConservativeWin || areEveryRadicalImpeached
    );
  }

  get hasRadicalWon() {
    const impeachedConservatives = this._players.filter(
      (player) => player.role === Role.CONSERVADOR && player.impeached
    );
    return (
      impeachedConservatives.length >= this._conservativesImpeachedToRadicalWin
    );
  }

  get winner() {
    if (this.hasModerateWon) {
      return Role.MODERADO;
    }

    if (this.hasConservativeWon) {
      return Role.CONSERVADOR;
    }

    if (this.hasRadicalWon) {
      return Role.RADICAL;
    }

    return null;
  }

  get isFinished() {
    return Boolean(this.winner);
  }

  get currentRound() {
    return this._rounds[this._rounds.length - 1];
  }

  get currentRoundIndex() {
    return this._rounds.length - 1;
  }

  get approvedLaws() {
    return this._rounds.flatMap((round) => round.approvedLaws);
  }

  get rejectedLaws() {
    const previouslyRejected = this._rounds
      .filter((round) => round !== this.currentRound)
      .flatMap((round) => round.rejectedLaws).length;

    return Number(this.currentRound.hasRejectedLaw) + previouslyRejected;
  }

  get president() {
    return this.currentRound.president;
  }

  get players() {
    return [...this._players];
  }

  get crisesIntervalToImpeach() {
    return this._crisesIntervalToImpeach;
  }
}
