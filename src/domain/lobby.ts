import { Either, left, right } from "./either";
import { Game } from "./game";

export class Lobby {
  private _players: string[] = [];

  private constructor() {}

  static create(): Either<never, Lobby> {
    return right(new Lobby());
  }

  addPlayer(player: string): Either<string, void> {
    if (this._players.includes(player)) {
      return left(`Jogador ${player} já está no lobby`);
    }
    this._players.push(player); 
    return right(undefined);
  }

  startGame(): Either<string, Game> {
    if (this._players.length < 6) {
      return left("Mínimo de 6 jogadores para iniciar o jogo");
    }

    return Game.create(this._players);
  }

  get players() {
    return this._players;
  }
}