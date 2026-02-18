import { LegislativeProposal } from 'src/domain/stage/legislative-proposal';
import { Law } from '../../data/laws';
import { Deck } from '../deck';
import { Either, left, right } from '../either';
import { Player } from '../player';
import { Stage, StageType } from './stage';

export enum CPIAction {
  SELECT_RAPPORTEUR = 'SELECT_RAPPORTEUR',
  DELIVER_CPI = 'DELIVER_CPI',
  ADVANCE_STAGE = 'ADVANCE_STAGE',
}

type CPIStageParams = {
  proposals: LegislativeProposal[];
  obstructed?: boolean;
  obstructionProposals?: LegislativeProposal[];
  currentAction?: CPIAction;
  isCPIVisibleToRapporteur?: boolean;
  nextRapporteurId?: string;
  isCPIOmitted?: boolean;
};

export class CPIStage extends Stage {
  readonly type = StageType.CPI;
  private _nextRapporteurId: string | null;
  private _isCPIVisibleToRapporteur: boolean;
  private _isCPIOmitted: boolean;
  private _proposals: LegislativeProposal[];
  private _obstructed: boolean;
  private _obstructionProposals: LegislativeProposal[] | null;

  constructor(params: CPIStageParams) {
    super(
      ['SELECT_RAPPORTEUR', 'DELIVER_CPI', 'ADVANCE_STAGE'],
      params.currentAction,
    );
    this._proposals = params.proposals;
    this._obstructed = params.obstructed ?? false;
    this._isCPIOmitted = params.isCPIOmitted ?? false;
    this._isCPIVisibleToRapporteur =
      params.isCPIVisibleToRapporteur ?? false;
    this._nextRapporteurId = params.nextRapporteurId ?? null;
    this._obstructionProposals = params.obstructionProposals ?? null;
  }

  chooseNextRapporteur(params: {
    issuerId?: string;
    chosen: Player;
    currentPresident: string;
    currentRapporteur: Player | null;
    nextPresident: Player;
  }): Either<string, void> {
    const [error] = this.assertCurrentAction('SELECT_RAPPORTEUR');
    if (error) return left(error);

    params.issuerId = params.issuerId ?? params.currentPresident;

    if (params.issuerId !== params.currentPresident) {
      return left('Apenas o presidente pode escolher o relator');
    }

    const [canBeNextRapporteurError] = CPIStage.canBeNextRapporteur({
      chosen: params.chosen,
      currentPresident: params.currentPresident,
      nextPresident: params.nextPresident,
      currentRapporteur: params.currentRapporteur,
    });

    if (canBeNextRapporteurError) {
      return left(canBeNextRapporteurError);
    }

    this._nextRapporteurId = params.chosen.id;

    if (!params.currentRapporteur || this._isCPIOmitted) {
      this.advanceAction(CPIAction.ADVANCE_STAGE);
      return right();
    }

    this.advanceAction();
    return right();
  }

  deliverCPI(
    lawsDeck: Deck<Law>,
    currentRapporteur: Player | null,
  ): Either<string, void> {
    const [error] = this.assertCurrentAction('DELIVER_CPI');
    if (error) return left(error);
    if (this._isCPIOmitted) {
      this.advanceAction();
      return right();
    }

    if (!currentRapporteur) {
      return left('Nenhum relator foi escolhido.');
    }

    if (this._obstructed) {
      const notVetoedLaws = this._proposals.filter((law) => !law.isVetoed);
      const randomLaws = lawsDeck.show(notVetoedLaws.length);
      const obstructionProposals = randomLaws.map((law) => new LegislativeProposal(law));
      this._obstructionProposals = obstructionProposals;
    }

    this._isCPIVisibleToRapporteur = true;
    this.advanceAction();
    return right();
  }

  get nextRapporteur(): string | null {
    return this._nextRapporteurId;
  }

  get isCPIVisibleToRapporteur(): boolean {
    return this._isCPIVisibleToRapporteur;
  }

  get cpiReport(): Law[] {
    if (this._obstructionProposals) {
      return this._obstructionProposals.map((law) => law.law);
    }
    return this._proposals.filter((law) => !law.isVetoed).map((law) => law.law);
  }

  toJSON() {
    return {
      ...super.toJSON(),
      type: this.type,
      currentAction: this.currentAction as CPIAction,
      nextRapporteurId: this._nextRapporteurId,
      isCPIOmitted: this._isCPIOmitted,
      isCPIVisibleToRapporteur: this._isCPIVisibleToRapporteur,
      cpiReport: this.cpiReport,
      proposals: this._proposals.map((law) => law.toJSON()),
    } as const;
  }

  static fromJSON(data: ReturnType<CPIStage['toJSON']>) {
    return new CPIStage({
      ...data,
      nextRapporteurId: data.nextRapporteurId ?? undefined,
      proposals: data.proposals.map((law) => LegislativeProposal.fromJSON(law)),
    });
  }

  static canBeNextRapporteur(params: {
    chosen: Player;
    currentPresident: string;
    nextPresident?: Player;
    currentRapporteur: Player | null;
  }): Either<string, true> {
    if (params.chosen.id === params.currentPresident) {
      return left('O presidente não pode ser o próximo relator');
    }
    if (params.currentRapporteur?.id === params.chosen.id) {
      return left('O relator atual não pode ser o próximo relator');
    }
    if (params.nextPresident?.id === params.chosen.id) {
      return left('O próximo presidente não pode ser o relator');
    }
    if (params.chosen.impeached) {
      return left('O relator não pode ter sido cassado');
    }

    return right(true);
  }
}
