import { Either, left, right } from "./either";
import { Game } from "./game";

export class Lobby {
  private _players: string[] = [];
  private _games: Game[] = [];

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

    const [error, game] = Game.create({
      players: this._players,
    });

    if (!game) {
      return left(error);
    }

    this._games.push(game);

    return right(game);
  }

  get currentGame() {
    return this._games[this._games.length - 1];
  }

  get players() {
    return this._players;
  }

  get games() {
    return Array.from(this._games.values());
  }
}