import { Either, left, right } from "./either";

export class Game {
  private constructor() {}

  static create(players: string[]): Either<string, Game> {
    if (players.length < 6) {
      return left("Mínimo de 6 jogadores para iniciar o jogo");
    }

    return right(new Game());
  }
}