import { Law } from "../data/laws";
import { Crisis } from "./crisis";
import { Either, left, right } from "./either";
import { Player } from "./player";
import { Voting } from "./voting";

type RoundParams = {
  president: Player;
  crisis?: Crisis;
};

export class Round {
  public drawnLaws: Law[] = [];
  public rapporteur: Player | null = null;
  private _lawToVote: Law | null = null;
  private _voting: Voting<Law> | null = null;
  private _crisis: Crisis | null;
  readonly president: Player;

  constructor(props: RoundParams) {
    this.president = props.president;
    this._crisis = props.crisis ?? null;
  }

  setDrawnLaws(laws: Law[]) {
    this.drawnLaws = laws;
  }

  chooseLaw(index: number) {
    this._lawToVote = this.drawnLaws[index];
  }

  chooseRapporteur(player: Player) {
    this.rapporteur = player;
  }

  startVoting(players: string[]): Either<string, void> {
    if (this._voting) {
      return left("Votação já iniciada");
    }

    if (!this._lawToVote) {
      return left("Nenhuma lei escolhida para votação");
    }

    const [error, voting] = Voting.create(
      this._lawToVote,
      players
    );

    if (!voting) {
      return left(error);
    }

    this._voting = voting;

    return right(undefined);
  }

  vote(playerName: string, vote: boolean): Either<string, void> {
    if (!this._voting) {
      return left("Votação não iniciada");
    }

    this._voting.vote(playerName, vote);

    return right(undefined);
  }

  endVoting(): Either<string, Law | null> {
    if (!this._voting) {
      return left("Votação não iniciada");
    }

    return this._voting.result 
      ? right(this._lawToVote)
      : right(null);
  }

  get crisis(): Crisis | null {
    return this._crisis;
  }

  get lawToVote(): Law | null {
    return this._lawToVote;
  }

  get voting(): Voting<Law> | null {
    return this._voting;
  }

  get votingCount() {
    return this._voting?.counting ?? null;
  }

  get votes() {
    return this._voting?.votes ?? null;
  }

  get votingResult() {
    return this._voting?.result ?? null;
  }
}
