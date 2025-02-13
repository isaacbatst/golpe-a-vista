import { CrisisStage } from './crisis-stage';
import { DossierStage } from './dossier-stage';
import { ImpeachmentStage } from './impeachment-stage';
import { LegislativeStage } from './legislative-stage';
import { RadicalizationStage } from './radicalization-stage';
import { SabotageStage } from './sabotage-stage';
import { Stage, StageType } from './stage';

type ToJson<T extends { toJSON: any }> = ReturnType<T['toJSON']>;
export type StageJSON =
  | ToJson<CrisisStage>
  | ToJson<LegislativeStage>
  | ToJson<ImpeachmentStage>
  | ToJson<DossierStage>
  | ToJson<SabotageStage>
  | ToJson<RadicalizationStage>;

export class StageFactory {
  static fromJSON(json: StageJSON): Stage {
    switch (json.type) {
      case StageType.CRISIS:
        return CrisisStage.fromJSON(json);
      case StageType.LEGISLATIVE:
        return LegislativeStage.fromJSON(json);
      case StageType.IMPEACHMENT:
        return ImpeachmentStage.fromJSON(json);
      case StageType.REPORT_DOSSIER:
        return DossierStage.fromJSON(json);
      case StageType.SABOTAGE:
        return SabotageStage.fromJSON(json);
      case StageType.RADICALIZATION:
        return RadicalizationStage.fromJSON(json);
    }
  }
}
