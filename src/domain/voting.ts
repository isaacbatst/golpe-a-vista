import { Either, left, right } from "./either";

export class Voting {
  private _votes: Map<string, boolean | null>;
  private _hasEnded = false;

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
    this._hasEnded = true;
  }

  vote(player: string, vote: boolean): boolean | null {
    if(this._hasEnded) return null;
    this._votes.set(player, vote);
    const somePlayerHasNotVoted = Array.from(this._votes.values()).some(
      (vote) => vote === null
    );
    if(somePlayerHasNotVoted) return false;
    this.end();
    return true;
  }

  get hasEnded() {
    return this._hasEnded;
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
    if(!this._hasEnded) return null;
    return counting.yes > counting.no + counting.abstention;
  }

  get votes() {
    return new Map(this._votes);
  }
}
