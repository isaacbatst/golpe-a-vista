import { Either, left, right } from "./either";

export class Lobby {
  private _players: string[] = [];

  private constructor() {}

  static create(): Either<never, Lobby> {
    return right(new Lobby());
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