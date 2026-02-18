import { SabotageCardControlledBy } from 'src/domain/sabotage-card/sabotage-card-controlled-by';
import { SabotageCardFactory } from 'src/domain/sabotage-card/sabotage-card-factory';
import { CPIStage } from 'src/domain/stage/cpi-stage';
import { Law } from '../data/laws';
import { SabotageCard } from './sabotage-card/sabotage-card';
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
  sabotagesIntervalToImpeach?: number;
  sabotageCardsDeck: Deck<SabotageCard>;
  lawsDeck: Deck<Law>;
  minProgressiveLawsToFearSabotage?: number;
  rounds?: Round[];
  rejectedLawsIntervalToSabotage?: number;
  presidentQueue?: PresidentQueue;
  conservativesImpeachedToRadicalWin?: number;
  minRadicalizationConservativesLaws?: number;
  minRadicalizationProgressiveLaws?: number;
};

export class Game {
  static createPlayers(
    players: [string, string][],
    roles: Role[] = Game.rolesByPlayersLength(players.length),
  ): Map<string, Player> {
    const rolesToDistribute = [...roles];

    let alreadyHasSaboteur = false;

    return new Map(
      players.map(([id, name]) => {
        const role = Random.extractFromArray(rolesToDistribute);
        const areThereConservativesRemaining = rolesToDistribute.includes(
          Role.CONSERVADOR,
        );
        let isSaboteur = false;
        if (
          role === Role.CONSERVADOR &&
          !alreadyHasSaboteur &&
          areThereConservativesRemaining
        ) {
          isSaboteur = Random.boolean();
          alreadyHasSaboteur = isSaboteur;
        }

        if (
          role === Role.CONSERVADOR &&
          !alreadyHasSaboteur &&
          !areThereConservativesRemaining
        ) {
          isSaboteur = true;
          alreadyHasSaboteur = true;
        }

        return [id, new Player(id, name, role, false, false, isSaboteur)];
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
  private _sabotagesIntervalToImpeach: number;
  private _presidentQueue: PresidentQueue;
  private _rounds: Round[];
  private _sabotageCardsDeck: Deck<SabotageCard>;
  private _progressiveLawsToFear: number;
  private _rejectedLawsIntervalToSabotage: number;
  private _conservativesImpeachedToRadicalWin: number;
  private _minRadicalizationConservativesLaws: number;
  private _minRadicalizationProgressiveLaws: number;

  static create(props: GameParams): Either<string, Game> {
    const {
      players,
      lawsDeck,
      sabotageCardsDeck,
      lawsToProgressiveWin = 6,
      lawsToConservativeWin = 7,
      sabotagesIntervalToImpeach = 3,
      minProgressiveLawsToFearSabotage = 2,
      rejectedLawsIntervalToSabotage = 2,
      conservativesImpeachedToRadicalWin = 2,
      minRadicalizationConservativesLaws = 4,
      minRadicalizationProgressiveLaws = 4,
    } = props;

    return right(
      new Game(
        players,
        lawsDeck,
        lawsToProgressiveWin,
        lawsToConservativeWin,
        sabotageCardsDeck,
        sabotagesIntervalToImpeach,
        minProgressiveLawsToFearSabotage,
        rejectedLawsIntervalToSabotage,
        conservativesImpeachedToRadicalWin,
        minRadicalizationConservativesLaws,
        minRadicalizationProgressiveLaws,
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
    sabotageCardsDeck: Deck<SabotageCard>,
    sabotagesIntervalToImpeach: number,
    progressiveLawsIntervalToSabotage: number,
    rejectedLawsIntervalToSabotage: number,
    conservativesImpeachedToRadicalWin: number,
    minRadicalizationConservativesLaws: number,
    minRadicalizationProgressiveLaws: number,
    presidentQueue?: PresidentQueue,
    rounds?: Round[],
  ) {
    this._players = players;
    this._lawsDeck = lawsDeck;
    this._lawsToProgressiveWin = lawsToProgressiveWin;
    this._lawsToConservativeWin = lawsToConservativeWin;
    this._sabotagesIntervalToImpeach = sabotagesIntervalToImpeach;
    this._presidentQueue =
      presidentQueue ??
      new PresidentQueue(
        Random.sort(Array.from(players.values()).map((p) => p.id)),
      );
    this._sabotageCardsDeck = sabotageCardsDeck;
    this._progressiveLawsToFear = progressiveLawsIntervalToSabotage;
    this._rejectedLawsIntervalToSabotage = rejectedLawsIntervalToSabotage;
    this._minRadicalizationConservativesLaws =
      minRadicalizationConservativesLaws;
    this._minRadicalizationProgressiveLaws = minRadicalizationProgressiveLaws;
    this._conservativesImpeachedToRadicalWin =
      conservativesImpeachedToRadicalWin;
    this._rounds = rounds ?? [
      new Round({
        index: 0,
        presidentQueue: this._presidentQueue,
        minRadicalizationConservativeLaws:
          this._minRadicalizationConservativesLaws,
        minRadicalizationProgressiveLaws:
          this._minRadicalizationProgressiveLaws,
      }),
    ];
  }

  nextRound(): Either<string, Round> {
    if (!this.currentRound.finished) {
      return left('A rodada atual não foi finalizada');
    }

    const nextPresidentId = this._presidentQueue.getByRoundNumber(
      this._rounds.length,
    );
    let nextPresident = this._players.get(nextPresidentId);
    if (!nextPresident) {
      return left('Próximo presidente não encontrado');
    }

    while (nextPresident.impeached) {
      this._presidentQueue.shift();
      nextPresident = this._players.get(
        this._presidentQueue.getByRoundNumber(this._rounds.length),
      );
      if (!nextPresident) {
        return left('Próximo presidente não encontrado');
      }
    }

    const round = new Round({
      presidentQueue: this._presidentQueue,
      index: this._rounds.length,
      sabotageCard: this.nextRoundSabotageCard,
      hasImpeachment: this.nextRoundShouldImpeach,
      rapporteurId: this.currentRound.nextRapporteur,
      minRadicalizationConservativeLaws:
        this._minRadicalizationConservativesLaws,
      minRadicalizationProgressiveLaws: this._minRadicalizationProgressiveLaws,
      hasLastRoundBeenSabotaged: Boolean(this.currentRound.interceptionSabotageCard),
      previouslyImpeachedRadical: this.players.some(
        (player) => player.role === Role.RADICAL && player.impeached,
      ),
      previouslyImpeachedSomeConservative: this.players.some(
        (player) => player.role === Role.CONSERVADOR && player.impeached,
      ),
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

  getPlayerById(id: string) {
    return this._players.get(id);
  }

  get sabotageCardsDeck() {
    return this._sabotageCardsDeck;
  }

  get lawsDeck() {
    return this._lawsDeck;
  }

  get nextRoundShouldImpeach() {
    const sabotageCardsCount = this._rounds.filter((round) => round.sabotageCard).length;
    if (sabotageCardsCount > 0 && sabotageCardsCount % this._sabotagesIntervalToImpeach === 0) {
      return true;
    }
  }

  get nextRoundSabotageCard() {
    if (this.currentRound.interceptionSabotageCard) {
      return this.currentRound.interceptionSabotageCard;
    }

    if (
      this.nextShouldHaveSabotagePerRejectedLaws ||
      this.nextShouldHaveSabotagePerModerateFear
    ) {
      return this._sabotageCardsDeck.draw(1)[0];
    }

    return null;
  }

  get nextShouldHaveSabotagePerRejectedLaws() {
    return (
      this.rejectedLaws > 0 &&
      this.rejectedLaws % this._rejectedLawsIntervalToSabotage === 0
    );
  }

  get nextShouldHaveSabotagePerModerateFear() {
    const lastRounds = this._rounds.slice(-this._progressiveLawsToFear);
    const lastRoundsApprovedProgressiveLaws = lastRounds.every((round) =>
      round.hasApprovedLaw(LawType.PROGRESSISTAS),
    );
    const president = this._players.get(this.presidentId);

    return (
      president?.role === Role.MODERADO &&
      !president?.radicalized &&
      this.currentRound.hasApprovedLaw(LawType.PROGRESSISTAS) &&
      lastRounds.length >= this._progressiveLawsToFear &&
      lastRoundsApprovedProgressiveLaws
    );
  }

  get moderatesWinConditions() {
    const conditions = [
      {
        isFulfilled:
          this.approvedLaws.filter((law) => law.type === LawType.PROGRESSISTAS)
            .length >= this._lawsToProgressiveWin,
        message: `Aprovar ${this._lawsToProgressiveWin} leis progressistas`,
      },
    ];
    return conditions;
  }

  get conservativesWinConditions() {
    const conditions = [
      {
        isFulfilled:
          this.approvedLaws.filter((law) => law.type === LawType.CONSERVADORES)
            .length >= this._lawsToConservativeWin,
        message: `Aprovar ${this._lawsToConservativeWin} leis conservadoras`,
      },
      {
        isFulfilled: Array.from(this._players.values())
          .filter((player) => player.role === Role.RADICAL)
          .every((player) => player.impeached),
        message: 'Cassar todos os jogadores radicais',
      },
    ];
    return conditions;
  }

  get radicalsWinConditions() {
    const conditions = [
      {
        isFulfilled:
          Array.from(this._players.values()).filter(
            (player) => player.role === Role.CONSERVADOR && player.impeached,
          ).length >= this._conservativesImpeachedToRadicalWin,
        message: `Cassar ${this._conservativesImpeachedToRadicalWin} conservadores`,
      },
      {
        isFulfilled:
          Array.from(this._players.values()).filter(
            (player) => player.role === Role.MODERADO && player.radicalized,
          ).length >=
          Array.from(this._players.values()).filter(
            (player) => player.role === Role.MODERADO,
          ).length /
            2,
        message: 'Radicalizar metade dos moderados',
      },
    ];
    return conditions;
  }

  get winner() {
    if (
      this.moderatesWinConditions.some((condition) => condition.isFulfilled)
    ) {
      return Role.MODERADO;
    }
    if (this.radicalsWinConditions.some((condition) => condition.isFulfilled)) {
      return Role.RADICAL;
    }
    if (
      this.conservativesWinConditions.some((condition) => condition.isFulfilled)
    ) {
      return Role.CONSERVADOR;
    }

    return null;
  }

  get winnerWinConditions() {
    if (this.winner === Role.MODERADO) {
      return this.moderatesWinConditions;
    }

    if (this.winner === Role.RADICAL) {
      return this.radicalsWinConditions;
    }

    if (this.winner === Role.CONSERVADOR) {
      return this.conservativesWinConditions;
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
    const approvedLaws: Law[] = [];
    for (let i = 0; i < this._rounds.length; i++) {
      const round = this._rounds[i];
      const nextRound = this._rounds[i + 1];
      const validLaws = round.approvedLaws.filter((law) => {
        if (!nextRound || !nextRound.disablePreviousLaw) {
          return true;
        }

        return law.type !== nextRound.disablePreviousLaw;
      });
      approvedLaws.push(...validLaws);
    }

    return approvedLaws;
  }

  get rejectedLaws() {
    const previouslyRejected = this._rounds
      .filter((round) => round !== this.currentRound)
      .flatMap((round) => round.rejectedLaws).length;

    return Number(this.currentRound.hasRejectedLaw) + previouslyRejected;
  }

  get presidentId() {
    return this.currentRound.presidentId;
  }

  get president() {
    return this._players.get(this.presidentId);
  }

  get nextPresident() {
    return this._players.get(
      this.getPresidentFromQueue(this.currentRoundIndex + 1),
    );
  }

  get rapporteur() {
    return this.currentRound.rapporteurId
      ? (this.getPlayerById(this.currentRound.rapporteurId) ?? null)
      : null;
  }

  get players() {
    return Array.from(this._players.values());
  }

  get votingPlayers() {
    return this.players.filter((player) => !player.impeached);
  }

  get sabotagesIntervalToImpeach() {
    return this._sabotagesIntervalToImpeach;
  }

  get presidentQueue() {
    return this._presidentQueue;
  }

  get sabotageCardControlledBy(): string | null {
    if (!this.currentRound.sabotageCard) {
      return null;
    }
    if (this.currentRound.sabotageCard.controlledBy.length === 0) {
      return this.presidentId;
    }

    for (const controller of this.currentRound.sabotageCard.controlledBy) {
      if (controller === SabotageCardControlledBy.PRESIDENT) {
        return this.presidentId;
      }

      if (
        controller === SabotageCardControlledBy.RAPPORTEUR &&
        this.currentRound.rapporteurId
      ) {
        return this.currentRound.rapporteurId;
      }

      if (controller === SabotageCardControlledBy.SABOTEUR) {
        const saboteur = Array.from(this._players.values()).find(
          (player) => player.saboteur && !player.impeached,
        );
        if (saboteur) {
          return saboteur.id;
        }
      }

      if (controller === SabotageCardControlledBy.CONSERVATIVE) {
        const conservative = Array.from(this._players.values()).find(
          (player) => player.role === Role.CONSERVADOR && !player.impeached,
        );
        if (conservative) {
          return conservative.id;
        }
      }
    }
    return null;
  }

  playerToJSON(player: Player & { id: string }) {
    return {
      ...player.toJSON(),
      isPresident: player.id === this.presidentId,
      isRapporteur: player.id === this.currentRound.rapporteurId,
      isNextPresident:
        player.id === this.getPresidentFromQueue(this.currentRoundIndex + 1),
    };
  }

  toJSON() {
    const approvedLaws = this.approvedLaws;
    return {
      players: Array.from(this._players.entries()).map(([id, player]) => {
        const [canBeRapporteurError, canBeRapporteur] =
          CPIStage.canBeNextRapporteur({
            chosen: player,
            currentPresident: this.presidentId,
            currentRapporteur: this.rapporteur,
            nextPresident: this.nextPresident,
          });
        return {
          ...player.toJSON(),
          id,
          isPresident: player.id === this.presidentId,
          isRapporteur: player.id === this.currentRound.rapporteurId,
          isNextPresident:
            player.id ===
            this.getPresidentFromQueue(this.currentRoundIndex + 1),
          canBeRapporteur: {
            status: canBeRapporteur ?? false,
            reason: canBeRapporteurError,
          },
        };
      }),
      rounds: this._rounds.map((round) => round.toJSON()),
      presidentQueue: this._presidentQueue.toJSON(),
      lawsDeck: this._lawsDeck.toJSON(),
      sabotageCardsDeck: this._sabotageCardsDeck.toJSON(),
      president: this.president,
      nextPresident: this.nextPresident,
      rapporteur: this.rapporteur,
      winner: this.winner,
      minRadicalizationConservativesLaws:
        this._minRadicalizationConservativesLaws,
      minRadicalizationProgressiveLaws: this._minRadicalizationProgressiveLaws,
      lawsToProgressiveWin: this._lawsToProgressiveWin,
      lawsToConservativeWin: this._lawsToConservativeWin,
      approvedConservativeLaws: approvedLaws.filter(
        (law) => law.type === LawType.CONSERVADORES,
      ),
      approvedProgressiveLaws: approvedLaws.filter(
        (law) => law.type === LawType.PROGRESSISTAS,
      ),
      sabotagesIntervalToImpeach: this._sabotagesIntervalToImpeach,
      currentRound: this.currentRound,
      sabotageCardControlledBy: this.sabotageCardControlledBy,
      winnerWinConditions: this.winnerWinConditions,
      progressiveLawsToFear: this._progressiveLawsToFear,
      rejectedLawsIntervalToSabotage: this._rejectedLawsIntervalToSabotage,
      conservativesImpeachedToRadicalWin:
        this._conservativesImpeachedToRadicalWin,
    };
  }

  static fromJSON(json: ReturnType<Game['toJSON']>): Game {
    const players = new Map(
      json.players.map((player) => [player.id, Player.fromJSON(player)]),
    );

    const sabotageCardsDeck = Deck.fromJSON(json.sabotageCardsDeck, SabotageCardFactory);
    const lawsDeck = Deck.fromJSON(json.lawsDeck, Law);
    const presidentQueue = PresidentQueue.fromJSON({
      offset: json.presidentQueue.offset,
      players: json.presidentQueue.players,
    });

    const [, game] = Game.create({
      ...json,
      players,
      sabotageCardsDeck,
      lawsDeck,
      presidentQueue,
      rounds: json.rounds.map((round) => Round.fromJSON(round, presidentQueue)),
    });
    return game!;
  }
}
