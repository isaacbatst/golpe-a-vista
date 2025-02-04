import { Law, LAWS } from "../data/laws";
import { Deck } from "./deck";
import { Either, left, right } from "./either";
import { Player } from "./player";
import { Random } from "./random";
import { Role } from "./role";

export class Game {
  static readonly LAWS_TO_DRAW = 2;

  private _players: Player[] = [];
  private _interimPresident: Player;
  private _deck: Deck<Law>;
  private _drawnLaws: Law[] = [];
  private _lawToVote: Law | null = null;

  static create(players: string[]): Either<string, Game> {
    if (players.length < 6) {
      return left("Mínimo de 6 jogadores para iniciar o jogo");
    }

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
