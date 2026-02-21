import { CPIStage } from 'src/domain/stage/cpi-stage';
import { LegislativeProposal } from 'src/domain/stage/legislative-proposal';
import { Stage } from 'src/domain/stage/stage';
import { StageFactory } from 'src/domain/stage/stage.factory';

export class CPIStageFactory extends StageFactory {
  constructor(
    private proposals: LegislativeProposal[] = [],
    private isObstructed: boolean = false,
    private isRapporteurImpeached: boolean = false,
    private isCPIOmitted: boolean = false,
  ) {
    super();
  }

  shouldSkip(): boolean {
    return this.proposals.length === 0 || this.isRapporteurImpeached;
  }

  create(): Stage {
    return new CPIStage({
      proposals: this.proposals,
      obstructed: this.isObstructed,
      isCPIOmitted: this.isCPIOmitted,
    });
  }
}
