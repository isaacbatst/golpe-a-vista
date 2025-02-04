import { Either, left, right } from "./either";
import { Player } from "./player";
import { Role } from "./role";

export class Game {
  private _players: Player[] = [];

  private constructor(players: string[]) {
    const roles = [Role.RADICAL, Role.MODERADO, Role.MODERADO, Role.MODERADO, Role.CONSERVADOR, Role.CONSERVADOR];
    players.forEach(playerName => {
      const role = roles.splice(Math.floor(Math.random() * roles.length), 1)[0];
      const player = new Player(playerName, role);
      this._players.push(player);
    });
  }

  static create(players: string[]): Either<string, Game> {
    if (players.length < 6) {
      return left("Mínimo de 6 jogadores para iniciar o jogo");
    }

    return right(new Game(players));
  }

  get players() {
    return [
      ...this._players
    ]
  }
}
