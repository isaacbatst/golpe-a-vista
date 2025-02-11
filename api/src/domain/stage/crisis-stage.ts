import { Crisis } from '../crisis/crisis';
import { Round } from '../round';
import { Stage, StageType } from './stage';

enum CrisisStageAction {
  EFFECT = 'EFFECT',
  ADVANCE_STAGE = 'ADVANCE_STAGE',
}

export class CrisisStage extends Stage {
  readonly type = StageType.CRISIS;

  constructor(readonly crisis: Crisis) {
    super([CrisisStageAction.EFFECT, CrisisStageAction.ADVANCE_STAGE]);
  }

  executeEffect(round: Round): void {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
    if (this.currentAction !== CrisisStageAction.EFFECT) {
      throw new Error('Invalid action');
    }

    this.crisis.effect(round);
    this.advanceAction();
  }
}
