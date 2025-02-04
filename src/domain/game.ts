import { Either, left, right } from "./either";
import { Player } from "./player";
import { Random } from "./random";
import { Role } from "./role";

export class Game {
  private _players: Player[] = [];
  private _interimPresident: Player;

  private constructor(players: string[]) {
    const roles = [Role.RADICAL, Role.MODERADO, Role.MODERADO, Role.MODERADO, Role.CONSERVADOR, Role.CONSERVADOR];
    players.forEach(playerName => {
      const role = Random.extractFromArray(roles);
      const player = new Player(playerName, role);
      this._players.push(player);
    });
    this._interimPresident = Random.getFromArray(this._players);
  }

  static create(players: string[]): Either<string, Game> {
    if (players.length < 6) {
      return left("Mínimo de 6 jogadores para iniciar o jogo");
    }

    return right(new Game(players));
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
