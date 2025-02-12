import { Law } from '../data/laws';
import { Crisis } from './crisis/crisis';
import { Deck } from './deck';
import { Either, left, right } from './either';
import { Player } from './player';
import { PresidentQueue } from './president-queue';
import { Random } from './random';
import { LawType, Role } from './role';
import { Round } from './round';

type GameParams = {
  players: Map<string, Player>;
  lawsToProgressiveWin?: number;
  lawsToConservativeWin?: number;
  crisesIntervalToImpeach?: number;
  crisesDeck: Deck<Crisis>;
  lawsDeck: Deck<Law>;
  minProgressiveLawsToFearCrisis?: number;
  rounds?: Round[];
  rejectedLawsIntervalToCrisis?: number;
  presidentQueue?: PresidentQueue;
  conservativesImpeachedToRadicalWin?: number;
};

export class Game {
  static createPlayers(
    players: [string, string][],
    roles: Role[] = Game.rolesByPlayersLength(players.length),
  ): Map<string, Player> {
    const rolesToDistribute = [...roles];
    return new Map(
      players.map(([id, name]) => {
        const role = Random.extractFromArray(rolesToDistribute);
        return [id, new Player(id, name, role)];
      }),
    );
  }

  static rolesByPlayersLength(length: number) {
    const map: Record<number, Role[]> = {
      7: [
        Role.RADICAL,
        Role.MODERADO,
        Role.MODERADO,
        Role.MODERADO,
        Role.CONSERVADOR,
        Role.CONSERVADOR,
        Role.MODERADO,
      ],
    };

    const roles = map[length];
    if (!roles) {
      throw new Error('Quantidade de jogadores não suportada  ');
    }
    return roles;
  }

  private _players: Map<string, Player>;
  private _lawsDeck: Deck<Law>;
  private _lawsToProgressiveWin: number;
  private _lawsToConservativeWin: number;
  private _crisesIntervalToImpeach: number;
  private _presidentQueue: PresidentQueue;
  private _rounds: Round[];
  private _crisesDeck: Deck<Crisis>;
  private _progressiveLawsToFear: number;
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
        props.rounds,
      ),
    );
  }

  private constructor(
    players: Map<string, Player>,
    lawsDeck: Deck<Law>,
    lawsToProgressiveWin: number,
    lawsToConservativeWin: number,
    crisesDeck: Deck<Crisis>,
    crisesIntervalToImpeach: number,
    progressiveLawsIntervalToCrisis: number,
    rejectedLawsIntervalToCrisis: number,
    conservativesImpeachedToRadicalWin: number,
    presidentQueue?: PresidentQueue,
    rounds?: Round[],
  ) {
    this._players = players;
    this._lawsDeck = lawsDeck;
    this._lawsToProgressiveWin = lawsToProgressiveWin;
    this._lawsToConservativeWin = lawsToConservativeWin;
    this._crisesIntervalToImpeach = crisesIntervalToImpeach;
    this._presidentQueue =
      presidentQueue ??
      new PresidentQueue(Random.sort(Array.from(players.values())));
    this._crisesDeck = crisesDeck;
    this._progressiveLawsToFear = progressiveLawsIntervalToCrisis;
    this._rejectedLawsIntervalToCrisis = rejectedLawsIntervalToCrisis;
    this._conservativesImpeachedToRadicalWin =
      conservativesImpeachedToRadicalWin;
    this._rounds = rounds ?? [
      new Round({
        index: 0,
        presidentQueue: this._presidentQueue,
        lawsDeck: this._lawsDeck,
        crisesDeck: this._crisesDeck,
      }),
    ];
  }

  nextRound(): Either<string, Round> {
    if (!this.currentRound.finished) {
      return left('A rodada atual não foi finalizada');
    }

    let nextPresident = this._presidentQueue.getByRoundNumber(
      this._rounds.length,
    );

    while (nextPresident.impeached) {
      this._presidentQueue.shift();
      nextPresident = this._presidentQueue.getByRoundNumber(
        this._rounds.length,
      );
    }

    const round = new Round({
      presidentQueue: this._presidentQueue,
      index: this._rounds.length,
      lawsDeck: this._lawsDeck,
      crisesDeck: this._crisesDeck,
      crisis: this.nextRoundCrisis,
      hasImpeachment: this.nextRoundShouldImpeach,
      rapporteur: this.currentRound.nextRapporteur,
      hasLastRoundBeenSabotaged: Boolean(this.currentRound.sabotageCrisis),
      previouslyApprovedConservativeLaws: this.approvedLaws.filter(
        (law) => law.type === LawType.CONSERVADORES,
      ).length,
      previouslyApprovedProgressiveLaws: this.approvedLaws.filter(
        (law) => law.type === LawType.PROGRESSISTAS,
      ).length,
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
      round.hasApprovedLaw(LawType.PROGRESSISTAS),
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
    const areEveryRadicalImpeached = Array.from(this._players.values())
      .filter((player) => player.role === Role.RADICAL)
      .every((player) => player.impeached);

    return (
      this.approvedLaws.filter((law) => law.type === LawType.CONSERVADORES)
        .length >= this._lawsToConservativeWin || areEveryRadicalImpeached
    );
  }

  get hasRadicalWon() {
    const impeachedConservatives = Array.from(this._players.values()).filter(
      (player) => player.role === Role.CONSERVADOR && player.impeached,
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
    return Array.from(this._players.values());
  }

  get crisesIntervalToImpeach() {
    return this._crisesIntervalToImpeach;
  }

  get presidentQueue() {
    return this._presidentQueue;
  }

  playerToJSON(player: Player & { id: string }) {
    return {
      ...player.toJSON(),
      isPresident: player === this.president,
      isRapporteur: player === this.currentRound.rapporteur,
      isNextPresident:
        player === this.getPresidentFromQueue(this.currentRoundIndex + 1),
    };
  }

  toJSON() {
    const approvedLaws = this.approvedLaws;
    return {
      players: Array.from(this._players.entries()).map(([id, player]) => ({
        ...player.toJSON(),
        id,
        isPresident: player === this.president,
        isRapporteur: player === this.currentRound.rapporteur,
        isNextPresident:
          player === this.getPresidentFromQueue(this.currentRoundIndex + 1),
      })),
      lawsDeck: this._lawsDeck.toJSON(),
      crisesDeck: this._crisesDeck.toJSON(),
      president: this.president.toJSON(),
      winner: this.winner,
      lawsToProgressiveWin: this._lawsToProgressiveWin,
      lawsToConservativeWin: this._lawsToConservativeWin,
      approvedConservativeLaws: approvedLaws.filter(
        (law) => law.type === LawType.CONSERVADORES,
      ),
      approvedProgressiveLaws: approvedLaws.filter(
        (law) => law.type === LawType.PROGRESSISTAS,
      ),
      crisesIntervalToImpeach: this._crisesIntervalToImpeach,
      rounds: this._rounds,
      currentRound: this.currentRound,
      progressiveLawsToFear: this._progressiveLawsToFear,
      rejectedLawsIntervalToCrisis: this._rejectedLawsIntervalToCrisis,
      conservativesImpeachedToRadicalWin:
        this._conservativesImpeachedToRadicalWin,
    };
  }
}
