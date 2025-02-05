import { Law, LAWS } from "../data/laws";
import { Deck } from "./deck";
import { Either, left, right } from "./either";
import { Player } from "./player";
import { Random } from "./random";
import { Role } from "./role";
import { Voting } from "./voting";

export class Game {
  static readonly LAWS_TO_DRAW = 2;

  private _players: Player[] = [];
  private _interimPresident: Player;
  private _deck: Deck<Law>;
  private _drawnLaws: Law[] = [];
  private _lawToVote: Law | null = null;
  private _voting: Voting<Law> | null = null;
  private _approvedLaws: Law[] = [];
  private _votingHistory: Voting<Law>[] = [];

  static create(players: string[]): Either<string, Game> {
    const [error, lawsDeck] = Game.createLawsDeck();

    if (!lawsDeck) {
      return left(error);
    }

    return right(new Game(players, lawsDeck));
  }

  private static createLawsDeck() {
    return Deck.create(LAWS)
  }

  private constructor(players: string[], deck: Deck<Law>) {
    const roles = [Role.RADICAL, Role.MODERADO, Role.MODERADO, Role.MODERADO, Role.CONSERVADOR, Role.CONSERVADOR];
    players.forEach(playerName => {
      const role = Random.extractFromArray(roles);
      const player = new Player(playerName, role);
      this._players.push(player);
    });
    this._interimPresident = Random.getFromArray(this._players);
    this._deck = deck;
  }

  drawLaws() {
    this._drawnLaws = this._deck.draw(Game.LAWS_TO_DRAW);
  }

  chooseLaw(index: number) {
    this._lawToVote = this._drawnLaws[index];
  }

  startVoting(): Either<string, void> {
    if(this._voting) {
      return left("Votação já iniciada");
    }

    if(!this._lawToVote) {
      return left("Nenhuma lei escolhida para votação");
    }
    
    const [error, voting] = Voting.create(this._lawToVote, this._players.map(player => player.name));

    if (!voting) {
      return left(error);
    }

    this._voting = voting;

    return right(undefined);
  }

  vote(playerName: string, vote: boolean): Either<string, void> {
    if (!this._voting) {
      return left("Votação não iniciada");
    }

    if(!this._players.find(player => player.name === playerName)) {
      return left("Jogador não encontrado");
    }

    this._voting.vote(playerName, vote);

    return right(undefined);
  }

  endVoting(): Either<string, void> {
    if(!this._voting) {
      return left("Votação não iniciada");
    }

    this._drawnLaws = [];
    this._lawToVote = null;

    if(this._voting.result) {
      this._approvedLaws.push(this._voting.subject);
    }

    this._votingHistory.push(this._voting);
    this._voting = null;
    return right(undefined);
  }

  get votingHistory() {
    return [
      ...this._votingHistory
    ]
  }

  get approvedLaws() {
    return [
      ...this._approvedLaws
    ]
  }

  get votingResult() {
    return this._voting?.counting ?? null;
  }

  get votes() {
    return this._voting?.votes ?? null;
  }

  get lawToVote() {
    return this._lawToVote;
  }
    
  get drawnLaws() {
    return [
      ...this._drawnLaws
    ]
  }

  get interimPresident() {
    return this._interimPresident;
  }

  get players() {
    return [
      ...this._players
    ]
  }
}
