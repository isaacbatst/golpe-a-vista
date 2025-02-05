import { Either, left, right } from "./either";

export class Voting<T> {
  private _subject: T;
  private _votes: Map<string, boolean | null>;

  private constructor(subject: T, players: string[]) {
    this._subject = subject;

    this._votes = new Map();

    players.forEach((player) => {
      this._votes.set(player, null);
    });
  }

  static create<T>(subject: T, players: string[]): Either<string, Voting<T>> {
    if (players.length < 2) {
      return left("Mínimo de 2 jogadores para iniciar uma votação");
    }
    return right(new Voting(subject, players));
  }

  vote(player: string, vote: boolean) {
    this._votes.set(player, vote);
  }

  get counting() {
    return {
      yes: Array.from(this._votes.values()).filter((vote) => vote === true)
        .length,
      no: Array.from(this._votes.values()).filter((vote) => vote === false)
        .length,
      abstention: Array.from(this._votes.values()).filter(
        (vote) => vote === null
      ).length,
    };
  }

  get result() {
    const counting = this.counting;
    return counting.yes > counting.no + counting.abstention;
  }

  get subject() {
    return this._subject;
  }

  get votes() {
    return new Map(this._votes);
  }
}
