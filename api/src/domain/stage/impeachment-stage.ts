import { Law } from 'src/data/laws';
import { Either, left, right } from '../either';
import { Player } from '../player';
import { LawType, Role } from '../role';
import { Voting } from '../voting';
import { Stage, StageType } from './stage';

export enum ImpeachmentAction {
  SELECT_TARGET = 'SELECT_TARGET',
  START_VOTING = 'START_VOTING',
  VOTING = 'VOTING',
  EXECUTION = 'EXECUTION',
  ADVANCE_STAGE = 'ADVANCE_STAGE',
}
export class ImpeachmentStage extends Stage {
  readonly type = StageType.IMPEACHMENT;
  private _targetId: string | null;
  private _targetRole: Role | null;
  private _voting: Voting | null;
  private _approvedLaw: Law | null;

  constructor(
    readonly accuserId: string,
    private _isSomeConservativeImpeached: boolean = false,
    private _isRadicalImpeached: boolean = false,
    currentAction?: ImpeachmentAction,
    targetId?: string,
    targetRole?: Role,
    voting?: Voting,
    approvedLaw?: Law,
  ) {
    super(
      ['SELECT_TARGET', 'START_VOTING', 'VOTING', 'EXECUTION', 'ADVANCE_STAGE'],
      currentAction,
    );
    this._targetId = targetId ?? null;
    this._targetRole = targetRole ?? null;
    this._voting = voting ?? null;
    this._approvedLaw = approvedLaw ?? null;
  }

  chooseTarget(targetId: string, targetRole: Role): Either<string, void> {
    const [error] = this.assertCurrentAction('SELECT_TARGET');
    if (error) return left(error);

    this._targetId = targetId;
    this._targetRole = targetRole;

    if (this.shouldSkipVoting) {
      this.actionController.currentAction = ImpeachmentAction.EXECUTION;
    } else {
      this.advanceAction();
    }
    return right();
  }

  startVoting(players: string[]): Either<string, Voting> {
    const [actionError] = this.assertCurrentAction('START_VOTING');
    if (actionError) return left(actionError);

    if (this.shouldSkipVoting) {
      return left('Votação ignorada.');
    }

    if (!this._targetId) return left('Nenhum alvo foi escolhido.');

    const [votingError, voting] = Voting.create(players);

    if (!voting) {
      return left(votingError);
    }

    this._voting = voting;
    this.advanceAction();
    return right(voting);
  }

  vote(
    playerId: string,
    approve: boolean,
    target: Player,
  ): Either<string, boolean> {
    const [error] = this.assertCurrentAction('VOTING');
    if (error) return left(error);

    if (this.shouldSkipVoting) return left('Votação ignorada.');

    if (!this._voting) return left('Votação não iniciada.');

    const hasEnded = this._voting.vote(playerId, approve);

    if (hasEnded) {
      this._voting.end();
      this.advanceAction();
      return this.impeach(target);
    }

    return right(this._voting.hasEnded);
  }

  impeach(target: Player): Either<string, boolean> {
    const [error] = this.assertCurrentAction('EXECUTION');
    if (error) return left(error);
    if (!this._voting && !this.shouldSkipVoting)
      return left('Votação não iniciada.');

    if (this._targetId && this.shouldImpeach && target.id === this._targetId) {
      target.impeached = true;
    }

    if (!this.shouldImpeach) {
      this._approvedLaw = new Law(
        'Lei Conservadora',
        LawType.CONSERVADORES,
        'Lei conservadora devido à rejeição da Impeachment.',
      );
    }

    this.advanceAction();
    return right(true);
  }

  get shouldImpeach() {
    return this.shouldSkipVoting || this._voting?.result;
  }

  get shouldSkipVoting() {
    if (!this._targetId) return null;

    return (
      this._targetRole === Role.CONSERVADOR &&
      this._isSomeConservativeImpeached &&
      !this._isRadicalImpeached
    );
  }

  get target() {
    return this._targetId;
  }

  get voting() {
    return this._voting;
  }

  get approvedLaw() {
    return this._approvedLaw;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      type: this.type,
      currentAction: this.currentAction as ImpeachmentAction,
      targetId: this._targetId,
      targetRole: this._targetRole,
      voting: this._voting?.toJSON(),
      shouldSkipVoting: this.shouldSkipVoting,
      accuserId: this.accuserId,
      isSomeConservativeImpeached: this._isSomeConservativeImpeached,
      isRadicalImpeached: this._isRadicalImpeached,
      approvedLaw: this._approvedLaw?.toJSON(),
    } as const;
  }

  static fromJSON(
    data: ReturnType<ImpeachmentStage['toJSON']>,
  ): ImpeachmentStage {
    return new ImpeachmentStage(
      data.accuserId,
      data.isSomeConservativeImpeached,
      data.isRadicalImpeached,
      data.currentAction,
      data.targetId ?? undefined,
      data.targetRole ?? undefined,
      data.voting ? Voting.fromJSON(data.voting) : undefined,
      data.approvedLaw ? Law.fromJSON(data.approvedLaw) : undefined,
    );
  }
}
