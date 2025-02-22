import { Law } from '../../data/laws';

export class LegislativeProposal {
  constructor(
    private _law: Law,
    private _isVetoed: boolean = false,
    private _isChosenForVoting: boolean = false,
  ) {}

  get law() {
    return this._law;
  }

  get isVetoed() {
    return this._isVetoed;
  }

  get isChosenForVoting() {
    return this._isChosenForVoting;
  }

  veto() {
    this._isVetoed = true;
  }

  chooseForVoting() {
    this._isChosenForVoting = true;
  }

  toJSON() {
    return {
      law: this._law.toJSON(),
      isVetoed: this._isVetoed,
      isChosenForVoting: this._isChosenForVoting,
    };
  }

  static fromJSON(data: ReturnType<LegislativeProposal['toJSON']>) {
    const proposal = new LegislativeProposal(
      Law.fromJSON(data.law),
      data.isVetoed,
      data.isChosenForVoting,
    );
    return proposal;
  }
}
