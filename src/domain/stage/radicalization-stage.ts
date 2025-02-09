import { Either, left, right } from "../either";
import { Player } from "../player";
import { Stage, StageType } from "./stage";

export enum RadicalizationAction {
  RADICALIZE = "RADICALIZE",
  ADVANCE_STAGE = "ADVANCE_STAGE",
}

export class RadicalizationStage extends Stage {
  readonly type = StageType.RADICALIZATION;

  constructor() {
    super([
      RadicalizationAction.RADICALIZE,
      RadicalizationAction.ADVANCE_STAGE,
    ]);
  }

  radicalize(target: Player): Either<string, boolean> {
    const [actionError] = this.assertCurrentAction(RadicalizationAction.RADICALIZE);
    if (actionError) {
      return left(actionError);
    }
    const [error, radicalized] = target.radicalize();
    if (error) {
      return left(error);
    }
    this.advanceAction();
    return right(radicalized);
  }
}
