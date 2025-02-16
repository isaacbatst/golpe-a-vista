import { LawType } from 'src/domain/role';
import { LegislativeStage } from 'src/domain/stage/legislative-stage';
import { Stage } from 'src/domain/stage/stage';
import { StageFactory } from 'src/domain/stage/stage.factory';

export class LegislativeStageFactory extends StageFactory {
  constructor(
    readonly requiredVeto: LawType | null = null,
    readonly isLegislativeVotingSecret: boolean = false,
  ) {
    super();
  }

  shouldSkip(): boolean {
    return false;
  }

  create(): Stage {
    return new LegislativeStage({
      mustVeto: this.requiredVeto,
      isVotingSecret: this.isLegislativeVotingSecret,
    });
  }
}
