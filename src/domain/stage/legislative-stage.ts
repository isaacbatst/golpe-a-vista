import { Law } from "../../data/laws";
import { Deck } from "../deck";
import { Either, left, right } from "../either";
import { LawType } from "../role";
import { Voting } from "../voting";
import { Stage, StageType } from "./stage";

export enum LegislativeAction {
  DRAW_LAWS = "DRAW_LAWS",
  VETO_LAW = "VETO_LAW",
  CHOOSE_LAW_FOR_VOTING = "CHOOSE_LAW_FOR_VOTING",
  START_VOTING = "START_VOTING",
  VOTING = "VOTING",
  ADVANCE_STAGE = "ADVANCE_STAGE",
}

export class LegislativeStage extends Stage {
  readonly type = StageType.LEGISLATIVE;
  private _drawnLaws: Law[] = [];
  private _vetoedLaw: Law | null = null;
  private _lawToVote: Law | null = null;
  private _voting: Voting | null = null;

  constructor(
    private _lawsDeck: Deck<Law>,
    private _mustVeto: LawType | null = null,
    currentAction?: LegislativeAction
  ) {
    super(
      [
        LegislativeAction.DRAW_LAWS,
        LegislativeAction.VETO_LAW,
        LegislativeAction.CHOOSE_LAW_FOR_VOTING,
        LegislativeAction.START_VOTING,
        LegislativeAction.VOTING,
        LegislativeAction.ADVANCE_STAGE,
      ],
      currentAction
    );
  }

  drawLaws(): Either<string, Law[]> {
    const [error] = this.assertCurrentAction(LegislativeAction.DRAW_LAWS);
    if (error) return left(error);
    this._drawnLaws = this._lawsDeck.draw(3);
    this.advanceAction();
    return right(this._drawnLaws);
  }

  vetoLaw(index: number): Either<string, void> {
    const [error] = this.assertCurrentAction(LegislativeAction.VETO_LAW);
    if (error) return left(error);

    if (index < 0 || index >= this._drawnLaws.length) {
      return left("Índice inválido.");
    }

    const law = this._drawnLaws[index];
    if (!this.vetoableLaws.includes(law)) {
      return left("Essa lei não pode ser vetada.");
    }

    this._vetoedLaw = this._drawnLaws[index];
    this.advanceAction();
    return right();
  }

  chooseLawForVoting(index: number): Either<string, void> {
    const [error] = this.assertCurrentAction(
      LegislativeAction.CHOOSE_LAW_FOR_VOTING
    );
    if (error) return left(error);

    const law = this._drawnLaws[index];
    if (!law) return left("Índice inválido.");
    if (law === this._vetoedLaw) return left("Essa lei foi vetada.");

    this._lawToVote = law;
    this.advanceAction();
    return right();
  }

  startVoting(players: string[]): Either<string, void> {
    const [error] = this.assertCurrentAction(LegislativeAction.START_VOTING);
    if (error) return left(error);

    if (!this._lawToVote)
      return left("Nenhuma lei foi escolhida para votação.");

    const [voteError, voting] = Voting.create(players);
    if (!voting) return left(voteError);

    this._voting = voting;
    this.advanceAction();
    return right();
  }

  vote(playerName: string, vote: boolean): Either<string, boolean> {
    const [error] = this.assertCurrentAction(LegislativeAction.VOTING);
    if (error) return left(error);
    if (!this._voting) return left("A votação não foi iniciada.");

    const hasEnded = this._voting.vote(playerName, vote);

    if (hasEnded) {
      return this.endVoting();
    }

    return right(false);
  }

  endVoting(): Either<string, true> {
    const [error] = this.assertCurrentAction(LegislativeAction.VOTING);
    if (error) return left(error);

    this._voting?.end();
    this.advanceAction();
    return right(true);
  }

  get drawnLaws() {
    return [...this._drawnLaws];
  }

  get lawToVote() {
    return this._lawToVote;
  }

  get vetoedLaw() {
    return this._vetoedLaw;
  }

  get votingCount() {
    return this._voting?.count ?? null;
  }

  get votingResult() {
    return this._voting?.result ?? null;
  }

  get votes() {
    return this._voting?.votes ?? null;
  }

  get votingHasEnded() {
    return this._voting?.hasEnded ?? null;
  }

  get mustVeto() {
    return this._mustVeto;
  }

  get vetoableLaws() {
    if (this._mustVeto === null) return this._drawnLaws;
    if (this._drawnLaws.every((law) => law.type !== this._mustVeto)) {
      return this.drawnLaws;
    }
    return this._drawnLaws.filter((law) => law.type === this._mustVeto);
  }
}
