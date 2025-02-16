import { Law } from 'src/data/laws';
import { DossierStage } from 'src/domain/stage/dossier-stage';
import { Stage } from 'src/domain/stage/stage';
import { StageFactory } from 'src/domain/stage/stage.factory';

export class DossierStageFactory extends StageFactory {
  constructor(
    private drawnLaws: Law[] = [],
    private isDossierFake: boolean = false,
  ) {
    super();
  }

  shouldSkip(): boolean {
    return this.drawnLaws.length === 0;
  }

  create(): Stage {
    return new DossierStage({
      drawnLaws: this.drawnLaws,
      fakeDossier: this.isDossierFake,
    });
  }
}
