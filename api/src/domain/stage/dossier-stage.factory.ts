import { DossierStage } from 'src/domain/stage/dossier-stage';
import { LegislativeProposal } from 'src/domain/stage/legislative-proposal';
import { Stage } from 'src/domain/stage/stage';
import { StageFactory } from 'src/domain/stage/stage.factory';

export class DossierStageFactory extends StageFactory {
  constructor(
    private proposals: LegislativeProposal[] = [],
    private isDossierFake: boolean = false,
    private isRapporteurImpeached: boolean = false,
    private isDossierOmitted: boolean = false,
  ) {
    super();
  }

  shouldSkip(): boolean {
    return this.proposals.length === 0 || this.isRapporteurImpeached;
  }

  create(): Stage {
    return new DossierStage({
      proposals: this.proposals,
      fakeDossier: this.isDossierFake,
      isDossierOmitted: this.isDossierOmitted,
    });
  }
}
