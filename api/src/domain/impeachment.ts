import { Either, left, right } from './either';
import { Player } from './player';
import { Role } from './role';
import { Voting } from './voting';

type Params = {
  target: Player;
  accuser: Player;
  isSomeConservativeImpeached?: boolean;
};

export class Impeachment {
  readonly target: Player;
  readonly accuser: Player;
  readonly isSomeConservativeImpeached: boolean;
  private _voting: Voting | null = null;

  constructor(params: Params) {
    this.target = params.target;
    this.accuser = params.accuser;
    this.isSomeConservativeImpeached =
      params.isSomeConservativeImpeached ?? false;
  }

  startVoting(players: string[]): Either<string, void> {
    if (this.shouldSkipVoting) {
      return left('Votação não é necessária');
    }

    const [error, voting] = Voting.create(players);

    if (!voting) {
      return left(error);
    }

    this._voting = voting;
    return right();
  }

  vote(player: string, approve: boolean): Either<string, void> {
    if (!this._voting) {
      return left('Votação não iniciada');
    }

    this._voting.vote(player, approve);
    return right();
  }

  impeach(): Either<string, boolean> {
    if (!this.shouldSkipVoting && !this._voting) {
      return left('Impeachment requer votação');
    }

    this._voting?.end();

    if (this._voting && this._voting.result === false) {
      return right(false);
    }

    this.target.impeached = true;
    return right(true);
  }

  get shouldSkipVoting() {
    return (
      this.target.role === Role.CONSERVADOR && this.isSomeConservativeImpeached
    );
  }

  get votingCount() {
    return this._voting?.count ?? null;
  }

  get votingResult() {
    return this._voting?.result ?? null;
  }
}
