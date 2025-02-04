import { Either, left, right } from "./either";

export class Game {
  private _players: string[] = [];

  private constructor() {}

  static create(): Either<never, Game> {
    return right(new Game());
  }

  addPlayer(player: string): Either<string, void> {
    if (this._players.includes(player)) {
      return left(`Jogador ${player} já está no jogo`);
    }
    this._players.push(player); 
    return right(undefined);
  }

  get players() {
    return this._players;
  }
}