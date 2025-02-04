import { Either, left, right } from "./either";

export class Voting {
  private _subject: string;
  private _votes: Map<string, boolean | null>;

  private constructor(subject: string, players: string[]) {
    this._subject = subject;

    this._votes = new Map();

    players.forEach(player => {
      this._votes.set(player, null);
    });
  }

  static create(subject: string, players: string[]): Either<string, Voting> {
    if (players.length < 2) {
      return left("Mínimo de 2 jogadores para iniciar uma votação");
    }
    return right(new Voting(subject, players));
  }

  get subject() {
    return this._subject;
  }

  get votes() {
    return new Map(this._votes);
  }
}