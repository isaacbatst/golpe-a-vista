import { SabotageCardEffectFactory } from 'src/domain/sabotage-card/sabotage-card-effect-factory';
import { SabotageCardStage } from './sabotage-card-stage';
import { CPIStage } from './cpi-stage';
import { ImpeachmentStage } from './impeachment-stage';
import { LegislativeStage } from './legislative-stage';
import { RadicalizationStage } from './radicalization-stage';
import { InterceptionStage } from './interception-stage';
import { Stage, StageType } from './stage';

type ToJson<T extends { toJSON: any }> = ReturnType<T['toJSON']>;
export type StageJSON =
  | ToJson<SabotageCardStage>
  | ToJson<LegislativeStage>
  | ToJson<ImpeachmentStage>
  | ToJson<CPIStage>
  | ToJson<InterceptionStage>
  | ToJson<RadicalizationStage>;

export abstract class StageFactory {
  abstract shouldSkip(): boolean;
  abstract create(): Stage;

  static fromJSON(json: StageJSON): Stage {
    switch (json.type) {
      case StageType.SABOTAGE_CARD:
        return SabotageCardStage.fromJSON(json, SabotageCardEffectFactory);
      case StageType.LEGISLATIVE:
        return LegislativeStage.fromJSON(json);
      case StageType.IMPEACHMENT:
        return ImpeachmentStage.fromJSON(json);
      case StageType.CPI:
        return CPIStage.fromJSON(json);
      case StageType.INTERCEPTION:
        return InterceptionStage.fromJSON(json);
      case StageType.RADICALIZATION:
        return RadicalizationStage.fromJSON(json);
    }
  }
}
