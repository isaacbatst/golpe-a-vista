import { Crisis } from "../crisis";
import { Deck } from "../deck";
import { Either, left, right } from "../either";
import { Stage, StageType } from "./stage";

export enum SabotageAction {
  DRAW_CRISIS = "DRAW_CRISIS",
  CHOOSE_CRISIS = "CHOOSE_CRISIS",
  ADVANCE_STAGE = "ADVANCE_STAGE",
}

export class SabotageStage extends Stage {
  readonly type = StageType.SABOTAGE;
  private _crisesDrawn: Crisis[] | null = null;
  private _selectedCrisis: Crisis | null = null;

  constructor(
    private _crisesDeck: Deck<Crisis>,
  ) {
    super([
      "DRAW_CRISIS",
      "CHOOSE_CRISIS",
      "ADVANCE_STAGE",
    ]);
  }

  drawCrises(): Either<string, Crisis[]> {
    const [error] = this.assertCurrentAction("DRAW_CRISIS");
    if (error) return left(error);

    this._crisesDrawn = this._crisesDeck.draw(3);
    this.advanceAction();
    return right(this._crisesDrawn);
  }

  chooseSabotageCrisis(index: number): Either<string, void> {
    const [error] = this.assertCurrentAction("CHOOSE_CRISIS");
    if (error) return left(error);

    if (!this._crisesDrawn) {
      return left("Crises de sabotagem não foram sacadas");
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
}
