import { Law } from "../data/laws";
import { Crisis } from "./crisis";
import { Deck } from "./deck";
import { Either, left, right } from "./either";
import { Player } from "./player";
import { Voting } from "./voting";

type RoundParams = {
  president: Player;
  deck: Deck<Law>;
  crisis?: Crisis;
  rapporteur?: Player | null;
};

export class Round {
  private static readonly LAWS_TO_DRAW = 3;

  public drawnLaws: Law[] = [];
  public rapporteur: Player | null = null;
  private _lawToVote: Law | null = null;
  private _voting: Voting<Law> | null = null;
  private _crisis: Crisis | null;
  private _deck: Deck<Law>;
  private _vetoedLaw: Law | null = null;
  private _nextRapporteur: Player | null = null;
  readonly president: Player;

  constructor(props: RoundParams) {
    this.president = props.president;
    this._crisis = props.crisis ?? null;
    this._deck = props.deck;
    this.rapporteur = props.rapporteur ?? null;
  }

  setNextRapporteur(player: Player) {
    this._nextRapporteur = player;
  }

  drawLaws() {
    const laws = this._deck.draw(Round.LAWS_TO_DRAW);
    this.drawnLaws = laws;
    return laws;
  }

  chooseLaw(index: number): Either<string, void> {
    if (this._vetoedLaw === this.drawnLaws[index]) {
      return left("Essa lei foi vetada");
    }

    this._lawToVote = this.drawnLaws[index];
    return right();
  }

  startVoting(players: string[]): Either<string, void> {
    if (this._voting) {
      return left("Votação já iniciada");
    }

    if (!this._lawToVote) {
      return left("Nenhuma lei escolhida para votação");
    }

    const [error, voting] = Voting.create(this._lawToVote, players);

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

    return this._voting.result ? right(this._lawToVote) : right(null);
  }

  vetoLaw(index: number) {
    this._vetoedLaw = this.drawnLaws[index];
  }

  get vetoedLaw(): Law | null {
    return this._vetoedLaw;
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

  get nextRapporteur() {
    return this._nextRapporteur;
  }
}
