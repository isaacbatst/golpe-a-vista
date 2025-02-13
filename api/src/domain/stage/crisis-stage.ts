import { Crisis } from '../crisis/crisis';
import { CrisisFactory } from '../crisis/crisis-factory';
import { Round } from '../round';
import { Stage, StageType } from './stage';

enum CrisisStageAction {
  EFFECT = 'EFFECT',
  ADVANCE_STAGE = 'ADVANCE_STAGE',
}

export class CrisisStage extends Stage {
  readonly type = StageType.CRISIS;

  constructor(
    readonly crisis: Crisis,
    currentAction?: CrisisStageAction,
  ) {
    super(
      [CrisisStageAction.EFFECT, CrisisStageAction.ADVANCE_STAGE],
      currentAction,
    );
  }

  executeEffect(round: Round): void {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
    if (this.currentAction !== CrisisStageAction.EFFECT) {
      throw new Error('Invalid action');
    }

    this.crisis.effect(round);
    this.advanceAction();
  }

  toJSON() {
    return {
      ...super.toJSON(),
      type: this.type,
      currentAction: this.currentAction as CrisisStageAction,
      crisis: this.crisis.toJSON(),
    } as const;
  }

  static fromJSON(data: ReturnType<CrisisStage['toJSON']>): CrisisStage {
    return new CrisisStage(Crisis.fromJSON(data.crisis, CrisisFactory));
  }
}
