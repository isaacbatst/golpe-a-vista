import { Law, LAWS } from "../data/laws";
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
};

export class Game {
  private static readonly LAWS_TO_DRAW = 2;
  private _players: Player[] = [];
  private _deck: Deck<Law>;
  private _approvedLaws: Law[] = [];
  private _lawsToProgressiveWin: number;
  private _lawsToConservativeWin: number;
  private _presidentQueue: Player[];
  private _rounds: Round[] = [];

  static create(
    props: GameParams
  ): Either<string, Game> {
    const {
      players,
      laws,
      lawsToProgressiveWin = 6,
      lawsToConservativeWin = 6,
    } = props;

    const [error, deck] = Deck.create(laws ?? LAWS);
    if (!deck) {
      return left(error);
    }

    return right(
      new Game(players, deck, lawsToProgressiveWin, lawsToConservativeWin)
    );
  }

  private constructor(players: string[], deck: Deck<Law>, lawsToProgressiveWin: number, lawsToConservativeWin: number) {
    const roles = [
      Role.RADICAL,
      Role.MODERADO,
      Role.MODERADO,
      Role.MODERADO,
      Role.CONSERVADOR,
      Role.CONSERVADOR,
    ];
    players.forEach((playerName) => {
      const role = Random.extractFromArray(roles);
      const player = new Player(playerName, role);
      this._players.push(player);
    });
    this._deck = deck;
    this._lawsToProgressiveWin = lawsToProgressiveWin;
    this._lawsToConservativeWin = lawsToConservativeWin;
    this._presidentQueue = [...Random.sort(this._players)];
    this._rounds.push(new Round({
      president: this._presidentQueue[0],
    }));
  }

  nextRound() {
    this._rounds.push(new Round({
      president: this._presidentQueue[this._rounds.length % this._presidentQueue.length],
    }));
  }

  drawLaws() {
    const laws = this._deck.draw(Game.LAWS_TO_DRAW);
    this.currentRound.setDrawnLaws(laws);
  }

  chooseLaw(index: number) {
    this.currentRound.chooseLaw(index);
  }

  startVoting() {
    return this.currentRound.startVoting(this._players.map((player) => player.name));
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
    }

    return right(law !== null);
  }


  chooseDossierRapporteur(player: Player): Either<string, void> {
    if(this.president === player){
      return left("O presidente não pode ser o relator");
    }

    const lastPresident = this._presidentQueue[(this.currentRoundIndex - 1) % this._presidentQueue.length];
    if(lastPresident === player){
      return left("O presidente anterior não pode ser o relator");
    }

    if(this.hasBeenRapporteur(player)){
      return left("O relator não pode ser escolhido duas vezes seguidas");
    }

    this.currentRound.chooseRapporteur(player);
  
    return right();
  }

  get hasProgressiveWon() {
    return this._approvedLaws.filter((law) => law.type === Faction.PROGRESSISTAS).length >= this._lawsToProgressiveWin;
  }

  get hasConservativeWon() {
    return this._approvedLaws.filter((law) => law.type === Faction.GOLPISTAS).length >= this._lawsToConservativeWin;
  }

  get winner() {
    if (this.hasProgressiveWon) {
      return Faction.PROGRESSISTAS;
    }

    if (this.hasConservativeWon) {
      return Faction.GOLPISTAS;
    }

    return null;
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
