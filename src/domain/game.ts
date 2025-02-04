import { Either, right } from "./either";

export class Game {
  private constructor() {}

  static create(): Either<string, Game> {
    return right(new Game());
  }
}