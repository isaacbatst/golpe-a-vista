import { Law } from '../../data/laws';
import { Deck } from '../deck';
import { Either, left, right } from '../either';
import { LawType } from '../role';
import { Voting } from '../voting';
import { Stage, StageType } from './stage';
import { LegislativeProposal } from './legislative-proposal';

export enum LegislativeAction {
  DRAW_LAWS = 'DRAW_LAWS',
  VETO_LAW = 'VETO_LAW',
  CHOOSE_LAW_FOR_VOTING = 'CHOOSE_LAW_FOR_VOTING',
  START_VOTING = 'START_VOTING',
  VOTING = 'VOTING',
  ADVANCE_STAGE = 'ADVANCE_STAGE',
}

type LegislativeStageParams = {
  mustVeto?: LawType | null;
  currentAction?: LegislativeAction;
  isVotingSecret?: boolean;
  proposals?: LegislativeProposal[];
  voting?: Voting | null;
};

export class LegislativeStage extends Stage {
  readonly type = StageType.LEGISLATIVE;
  private _proposals: LegislativeProposal[] = [];
  private _voting: Voting | null;
  private _isVotingSecret: boolean;
  private _mustVeto: LawType | null;

  constructor(params: LegislativeStageParams = {}) {
    const {
      proposals = [],
      voting = null,
      mustVeto = null,
      currentAction = LegislativeAction.DRAW_LAWS,
      isVotingSecret = false,
    } = params;
    super(
      [
        LegislativeAction.DRAW_LAWS,
        LegislativeAction.VETO_LAW,
        LegislativeAction.CHOOSE_LAW_FOR_VOTING,
        LegislativeAction.START_VOTING,
        LegislativeAction.VOTING,
        LegislativeAction.ADVANCE_STAGE,
      ],
      currentAction,
    );
    this._mustVeto = mustVeto;
    this._isVotingSecret = isVotingSecret;
    this._proposals = proposals;
    this._voting = voting;
  }

  drawLaws(
    lawsDeck: Deck<Law>,
    issuerId: string,
    presidentId: string,
  ): Either<string, LegislativeProposal[]> {
    const [error] = this.assertCurrentAction(LegislativeAction.DRAW_LAWS);
    if (error) return left(error);
    if (issuerId !== presidentId) {
      return left('Apenas o presidente pode sortear leis.');
    }
    const laws = lawsDeck.draw(3);
    this._proposals = laws.map((law) => new LegislativeProposal(law));
    this.advanceAction();
    return right(this._proposals);
  }

  vetoLaw(
    index: number,
    issuerId: string,
    presidentId: string,
  ): Either<string, void> {
    const [error] = this.assertCurrentAction(LegislativeAction.VETO_LAW);
    if (error) return left(error);

    if (issuerId !== presidentId) {
      return left('Apenas o presidente pode vetar leis.');
    }

    if (index < 0 || index >= this._proposals.length) {
      return left('Índice inválido.');
    }

    const proposal = this._proposals[index];
    if (!this.vetoableProposals.includes(proposal)) {
      return left('Essa proposta não pode ser vetada.');
    }

    proposal.veto();
    this.advanceAction();
    return right();
  }

  chooseLawForVoting(
    index: number,
    issuerId: string,
    presidentId: string,
  ): Either<string, void> {
    const [error] = this.assertCurrentAction(
      LegislativeAction.CHOOSE_LAW_FOR_VOTING,
    );
    if (error) return left(error);
    if (issuerId !== presidentId) {
      return left('Apenas o presidente pode escolher leis para votação.');
    }

    const proposal = this._proposals[index];
    if (!proposal) return left('Índice inválido.');
    if (proposal.isVetoed) return left('Essa proposta foi vetada.');

    proposal.chooseForVoting();
    this.advanceAction();
    return right();
  }

  startVoting(players: string[]): Either<string, void> {
    const [error] = this.assertCurrentAction(LegislativeAction.START_VOTING);
    if (error) return left(error);

    const lawToVote = this._proposals.find(
      (proposal) => proposal.isChosenForVoting,
    )?.law;
    if (!lawToVote) return left('Nenhuma lei foi escolhida para votação.');

    const [voteError, voting] = Voting.create(players);
    if (!voting) return left(voteError);

    this._voting = voting;
    this.advanceAction();
    return right();
  }

  vote(playerName: string, vote: boolean): Either<string, boolean> {
    const [error] = this.assertCurrentAction(LegislativeAction.VOTING);
    if (error) return left(error);
    if (!this._voting) return left('A votação não foi iniciada.');

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

  get proposals() {
    return this._proposals;
  }

  get drawnLaws() {
    return this._proposals.map((proposal) => proposal.law);
  }

  get lawToVote() {
    return this._proposals.find((proposal) => proposal.isChosenForVoting)?.law;
  }

  get vetoedLaw() {
    return this._proposals.find((proposal) => proposal.isVetoed)?.law;
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

  get vetoableProposals() {
    if (this._mustVeto === null) return this._proposals;
    if (
      this._proposals.every((proposal) => proposal.law.type !== this._mustVeto)
    ) {
      return this._proposals;
    }
    return this._proposals.filter(
      (proposal) => proposal.law.type === this._mustVeto,
    );
  }

  get isVotingSecret() {
    return this._isVotingSecret;
  }

  get isLawToVoteVisible() {
    return (
      (this.currentAction as LegislativeAction) ===
        LegislativeAction.ADVANCE_STAGE &&
      this._proposals.some((proposal) => proposal.isChosenForVoting) &&
      this._voting?.result
    );
  }

  toJSON() {
    return {
      ...super.toJSON(),
      type: this.type,
      currentAction: this.currentAction as LegislativeAction,
      proposals: this._proposals.map((proposal) => proposal.toJSON()),
      notVetoableProposals: this._proposals
        .filter((proposal) => !this.vetoableProposals.includes(proposal))
        .map((proposal) => ({
          id: proposal.law.id,
          reason: `É obrigatório vetar uma lei do tipo "${this._mustVeto}".`,
        })),
      voting: this._voting?.toJSON(),
      mustVeto: this._mustVeto,
      isVotingSecret: this._isVotingSecret,
      isLawToVoteVisible: this.isLawToVoteVisible,
    } as const;
  }

  static fromJSON(data: ReturnType<LegislativeStage['toJSON']>) {
    return new LegislativeStage({
      ...data,
      currentAction: data.currentAction,
      proposals: data.proposals.map((proposal) =>
        LegislativeProposal.fromJSON(proposal),
      ),
      voting: data.voting ? Voting.fromJSON(data.voting) : null,
    });
  }
}
