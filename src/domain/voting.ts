import { Either, left, right } from "./either";

export class Voting {
  private _votes: Map<string, boolean | null>;
  private _ended = false;

  private constructor(players: string[]) {
    this._votes = new Map();

    players.forEach((player) => {
      this._votes.set(player, null);
    });
  }

  static create(players: string[]): Either<string, Voting> {
    if (players.length < 2) {
      return left("Mínimo de 2 jogadores para iniciar uma votação");
    }
    return right(new Voting(players));
  }

  end() {
    this._ended = true;
  }

  vote(player: string, vote: boolean) {
    if(this._ended) return;
    this._votes.set(player, vote);
  }

  get count() {
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
    const counting = this.count;
    if(!this._ended) return null;
    return counting.yes > counting.no + counting.abstention;
  }

  get votes() {
    return new Map(this._votes);
  }
}
