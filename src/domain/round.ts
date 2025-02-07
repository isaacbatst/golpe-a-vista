import { Law } from "../data/laws";
import { Crisis } from "./crisis";
import { Deck } from "./deck";
import { Either, left, right } from "./either";
import { Player } from "./player";
import { LawType } from "./role";
import { Voting } from "./voting";

type RoundParams = {
  president: Player;
  lawsDeck: Deck<Law>;
  crisesDeck: Deck<Crisis>;
  crisis?: Crisis | null;
  rapporteur?: Player | null;
  impeachment?: boolean;
};

export class Round {
  private static readonly LAWS_TO_DRAW = 3;

  public rapporteur: Player | null = null;
  public nextShouldHaveCrisisPerRejectedLaw = false;
  private _drawnLaws: Law[] = [];
  private _crisis: Crisis | null;
  private _lawToVote: Law | null = null;
  private _voting: Voting<Law> | null = null;
  private _crisesDeck: Deck<Crisis>;
  private _lawsDeck: Deck<Law>;
  private _vetoedLaw: Law | null = null;
  private _nextRapporteur: Player | null = null;
  private _sabotageCrisesDrawn: Crisis[] | null = null;
  private _sabotageCrisis: Crisis | null = null;
  private _impeachment: boolean;
  private _impeached: Player | null = null;

  readonly president: Player;

  constructor(props: RoundParams) {
    this.president = props.president;
    this._crisesDeck = props.crisesDeck;
    this._crisis = props.crisis ?? null;
    this._lawsDeck = props.lawsDeck;
    this._impeachment = props.impeachment ?? false;
    this.rapporteur = props.rapporteur ?? null;
  }

  impeach(player: Player): Either<string, void> {
    if (!this._impeachment) {
      return left("Cassação não está ativa");
    }

    this._impeached = player;
    player.impeached = true;
    return right();
  }

  setNextRapporteur(player: Player) {
    this._nextRapporteur = player;
  }

  drawLaws() {
    const laws = this._lawsDeck.draw(Round.LAWS_TO_DRAW);
    this._drawnLaws = laws;
    return laws;
  }

  chooseLaw(index: number): Either<string, void> {
    if (this._vetoedLaw === this._drawnLaws[index]) {
      return left("Essa lei foi vetada");
    }

    this._lawToVote = this._drawnLaws[index];
    return right();
  }

  canSabotage(): boolean {
    return this._lawToVote?.type === LawType.PROGRESSISTAS;
  }

  sabotage(): Either<string, Crisis[]> {
    if (!this.canSabotage()) {
      return left("Não é possível sabotar");
    }

    const crises = this._crisesDeck.draw(3);
    this._sabotageCrisesDrawn = crises;
    return right(crises);
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
    this._vetoedLaw = this._drawnLaws[index];
  }

  chooseSabotageCrisis(index: number): Either<string, void> {
    if (!this._sabotageCrisesDrawn) {
      return left("Não há crises para sabotar");
    }
    this._sabotageCrisis = this._sabotageCrisesDrawn[index];
    return right();
  }

  get sabotageCrisis() {
    return this._sabotageCrisis;
  }

  get sabotageCrisesDrawn(): Crisis[] | null {
    return this.sabotageCrisesDrawn ? [...this._sabotageCrisesDrawn!] : null;
  }

  get drawnLaws() {
    return [...this._drawnLaws];
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

  get impeachment() {
    return this._impeachment;
  }

  get impeached() {
    return this._impeached;
  }
}
