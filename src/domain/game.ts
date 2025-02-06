import CRISES from "../data/crises";
import { Law, LAWS } from "../data/laws";
import { Crisis } from "./crisis";
import { Deck } from "./deck";
import { Either, left, right } from "./either";
import { Player } from "./player";
import { Random } from "./random";
import { Faction, Role } from "./role";
import { Round } from "./round";

type GameParams = {
  players: string[];
  lawsToProgressiveWin?: number;
  lawsToConservativeWin?: number;
  laws?: Law[];
  roles?: Role[];
  crises?: Crisis[];
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
  private _presidentQueue: Player[];
  private _rounds: Round[] = [];
  private _roles: Role[];
  private _crisesDeck: Deck<Crisis>;

  static create(props: GameParams): Either<string, Game> {
    const {
      players,
      laws,
      roles = [...Game.ROLES_DISTRIBUTION],
      lawsToProgressiveWin = 6,
      lawsToConservativeWin = 6,
    } = props;

    const [errorLawsDeckCreate, lawsDeck] = Deck.create(laws ?? LAWS);
    if (!lawsDeck) {
      return left(errorLawsDeckCreate);
    }
    const [errorCrisesDeckCreate, crisesDeck] = Deck.create(
      props.crises ??
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
        crisesDeck
      )
    );
  }

  private constructor(
    players: string[],
    lawsDeck: Deck<Law>,
    lawsToProgressiveWin: number,
    lawsToConservativeWin: number,
    roles: Role[],
    crisesDeck: Deck<Crisis>
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
    this._presidentQueue = [...Random.sort(this._players)];
    this._crisesDeck = crisesDeck;
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

  vote(playerName: string, vote: boolean) {
    this.currentRound.vote(playerName, vote);
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

    this.currentRound.setNextRapporteur(player);

    return right();
  }

  sabotage() {
    return this.currentRound.sabotage();
  }

  chooseSabotageCrisis(index: number) {
    return this.currentRound.chooseSabotageCrisis(index);
  }

  getPresidentFromQueue(round: number) {
    return this._presidentQueue[round % this._presidentQueue.length];
  }

  get nextRoundCrisis() {
    if(this.currentRound.sabotageCrisis){
      return this.currentRound.sabotageCrisis;
    }

    if(this.currentRound.nextShouldHaveCrisisPerRejectedLaw || this.nextShouldHaveCrisesPerModerateFear){
      return this._crisesDeck.draw(1)[0];
    }

    return null;
  }

  get nextShouldHaveCrisesPerModerateFear() {
    const lastTwoLaws = this._approvedLaws.slice(-2);
    if (lastTwoLaws.length < 2) {
      return false;
    }
    const lastTwoLawsAreProgressive = lastTwoLaws.every(
      (law) => law.type === Faction.PROGRESSISTAS
    );
    if (!lastTwoLawsAreProgressive) {
      return false;
    }
    if (this.president.role !== Role.MODERADO) {
      return false;
    }
    if (!this.currentRound.votingResult) {
      return false;
    }
    if (
      !this.currentRound.lawToVote ||
      this.currentRound.lawToVote.type !== Faction.PROGRESSISTAS
    ) {
      return false;
    }
    return true;
  }

  get hasProgressiveWon() {
    return (
      this._approvedLaws.filter((law) => law.type === Faction.PROGRESSISTAS)
        .length >= this._lawsToProgressiveWin
    );
  }

  get hasConservativeWon() {
    return (
      this._approvedLaws.filter((law) => law.type === Faction.CONSERVADORES)
        .length >= this._lawsToConservativeWin
    );
  }

  get winner() {
    if (this.hasProgressiveWon) {
      return Faction.PROGRESSISTAS;
    }

    if (this.hasConservativeWon) {
      return Faction.CONSERVADORES;
    }

    return null;
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

  private hasBeenRapporteur(player: Player): boolean {
    return this._rounds.some((round) => round.rapporteur === player);
  }
}
