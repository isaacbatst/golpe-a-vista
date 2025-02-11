import { Either, left, right } from "../either";
import { Player } from "../player";
import { Role } from "../role";
import { Voting } from "../voting";
import { Stage, StageType } from "./stage";

export enum ImpeachmentAction {
  SELECT_TARGET = "SELECT_TARGET",
  START_VOTING = "START_VOTING",
  VOTING = "VOTING",
  EXECUTION = "EXECUTION",
  ADVANCE_STAGE = "ADVANCE_STAGE",
}
export class ImpeachmentStage extends Stage {
  readonly type = StageType.IMPEACHMENT;
  private _target: Player | null = null;
  private _voting: Voting | null = null;

  constructor(
    readonly accuser: Player,
    private _isSomeConservativeImpeached: boolean = false,
    private _isRadicalImpeached: boolean = false,
    currentAction?: ImpeachmentAction,
  ) {
    super([
      "SELECT_TARGET",
      "START_VOTING",
      "VOTING",
      "EXECUTION",
      "ADVANCE_STAGE",
    ], currentAction);
  }

  chooseTarget(target: Player): Either<string, void> {
    const [error] = this.assertCurrentAction("SELECT_TARGET");
    if (error) return left(error);

    this._target = target;

    if (this.shouldSkipVoting) {
      this.actionController.currentAction = ImpeachmentAction.EXECUTION;
    } else {
      this.advanceAction();
    }
    return right();
  }

  startVoting(players: string[]): Either<string, void> {
    const [actionError] = this.assertCurrentAction("START_VOTING");
    if (actionError) return left(actionError);

    if (this.shouldSkipVoting) {
      return left("Votação ignorada.");
    }

    if (!this._target) return left("Nenhum alvo foi escolhido.");

    const [votingError, voting] = Voting.create(players);

    if (!voting) {
      return left(votingError);
    }

    this._voting = voting;
    this.advanceAction();
    return right();
  }

  vote(player: string, approve: boolean): Either<string, boolean> {
    const [error] = this.assertCurrentAction("VOTING");
    if (error) return left(error);

    if (this.shouldSkipVoting) return left("Votação ignorada.");

    if (!this._voting) return left("Votação não iniciada.");

    const hasEnded = this._voting.vote(player, approve);

    if(hasEnded) {
      this.advanceAction();
      return this.impeach();
    }

    return right(this._voting.hasEnded);
  }


  impeach(): Either<string, boolean> {
    const [error] = this.assertCurrentAction("EXECUTION");
    if (error) return left(error);
    if (!this._voting && !this.shouldSkipVoting)
      return left("Votação não iniciada.");

    if (this._target && this._voting?.result) {
      this._target.impeached = true;
    }

    this.advanceAction();
    return right(true);
  }

  get shouldSkipVoting() {
    if (!this._target) return null;

    return (
      this._target.role === Role.CONSERVADOR &&
      this._isSomeConservativeImpeached &&
      !this._isRadicalImpeached
    );
  }

  get target() {
    return this._target;
  }
}
