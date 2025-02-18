import { Crisis } from '../crisis/crisis';
import { CrisisFactory } from '../crisis/crisis-factory';
import { Deck } from '../deck';
import { Either, left, right } from '../either';
import { Stage, StageType } from './stage';

export enum SabotageAction {
  SABOTAGE_OR_SKIP = 'SABOTAGE_OR_SKIP',
  DRAW_CRISIS = 'DRAW_CRISIS',
  CHOOSE_CRISIS = 'CHOOSE_CRISIS',
  ADVANCE_STAGE = 'ADVANCE_STAGE',
}

export class SabotageStage extends Stage {
  readonly type = StageType.SABOTAGE;
  private _crisesDrawn: Crisis[] | null;
  private _selectedCrisis: Crisis | null;

  constructor(
    currentAction?: SabotageAction,
    crisesDrawn?: Crisis[],
    selectedCrisis?: Crisis,
  ) {
    super(
      [
        SabotageAction.SABOTAGE_OR_SKIP,
        SabotageAction.DRAW_CRISIS,
        SabotageAction.CHOOSE_CRISIS,
        SabotageAction.ADVANCE_STAGE,
      ],
      currentAction,
    );
    this._crisesDrawn = crisesDrawn ?? null;
    this._selectedCrisis = selectedCrisis ?? null;
  }

  sabotageOrSkip(sabotage: boolean): Either<string, void> {
    const [error] = this.assertCurrentAction('SABOTAGE_OR_SKIP');
    if (error) return left(error);

    if (sabotage) {
      this.advanceAction();
    } else {
      this.advanceAction(SabotageAction.ADVANCE_STAGE);
    }
    return right();
  }

  drawCrises(crisesDeck: Deck<Crisis>): Either<string, Crisis[]> {
    const [error] = this.assertCurrentAction('DRAW_CRISIS');
    if (error) return left(error);

    this._crisesDrawn = crisesDeck.draw(3);
    this.advanceAction();
    return right(this._crisesDrawn);
  }

  chooseSabotageCrisis(index: number): Either<string, void> {
    const [error] = this.assertCurrentAction('CHOOSE_CRISIS');
    if (error) return left(error);

    if (!this._crisesDrawn) {
      return left('Crises de sabotagem não foram sacadas');
    }

    this._selectedCrisis = this._crisesDrawn[index];
    this.advanceAction();
    return right();
  }

  get selectedCrisis(): Crisis | null {
    return this._selectedCrisis;
  }

  get drawnCrises(): Crisis[] | null {
    return this._crisesDrawn;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      type: this.type,
      currentAction: this.currentAction as SabotageAction,
      selectedCrisis: this._selectedCrisis?.toJSON(),
      drawnCrises: this._crisesDrawn?.map((crisis) => crisis.toJSON()),
    } as const;
  }

  static fromJSON(data: ReturnType<SabotageStage['toJSON']>): SabotageStage {
    const stage = new SabotageStage(
      data.currentAction,
      data.drawnCrises?.map((crisis) => Crisis.fromJSON(crisis, CrisisFactory)),
      data.selectedCrisis
        ? Crisis.fromJSON(data.selectedCrisis, CrisisFactory)
        : undefined,
    );
    return stage;
  }
}
