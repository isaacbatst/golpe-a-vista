import { Law } from '../../data/laws';
import { Crisis } from '../crisis/crisis';
import { LawType } from '../role';
import { CrisisStage } from './crisis-stage';
import { DossierStage } from './dossier-stage';
import { ImpeachmentStage } from './impeachment-stage';
import { LegislativeStage } from './legislative-stage';
import { RadicalizationStage } from './radicalization-stage';
import { SabotageStage } from './sabotage-stage';
import { Stage } from './stage';

export enum RoundStageIndex {
  IMPEACHMENT = 0,
  CRISIS = 1,
  LEGISLATIVE = 2,
  DOSSIER = 3,
  SABOTAGE = 4,
  RADICALIZATION = 5,
}

type StageQueueParams = {
  presidentId: string;
  crisis?: Crisis | null;
  drawnLaws: Law[];
  hasApprovedLaw: (lawType: LawType) => boolean;
  hasMinLawsToRadicalization: () => boolean;
  isDossierFake: boolean;
  isLegislativeVotingSecret: boolean;
  requiredVeto: LawType | null;
  hasLastRoundBeenSabotaged: boolean;
  hasImpeachment: boolean;
};

export class StageQueue {
  constructor(private _currentStageIndex: number = 0) {}

  nextStage({
    presidentId,
    crisis,
    hasImpeachment,
    drawnLaws,
    hasApprovedLaw,
    hasMinLawsToRadicalization,
    isDossierFake,
    isLegislativeVotingSecret,
    requiredVeto,
    hasLastRoundBeenSabotaged,
  }: StageQueueParams): Stage | null {
    const stages: {
      factory: () => Stage;
      condition?: () => boolean;
    }[] = [
      {
        factory: () => new ImpeachmentStage(presidentId),
        condition: () => hasImpeachment,
      },
      {
        factory: () => new CrisisStage(crisis!),
        condition: () => Boolean(crisis),
      },
      {
        factory: () =>
          new LegislativeStage({
            mustVeto: requiredVeto,
            isVotingSecret: isLegislativeVotingSecret,
          }),
      },
      {
        factory: () =>
          new DossierStage({
            drawnLaws: drawnLaws,
            fakeDossier: isDossierFake,
          }),
        condition: () => drawnLaws.length > 0,
      },
      {
        factory: () => new SabotageStage(),
        condition: () =>
          hasApprovedLaw(LawType.PROGRESSISTAS) && !hasLastRoundBeenSabotaged,
      },
      {
        factory: () => new RadicalizationStage(),
        condition: () => Boolean(hasMinLawsToRadicalization() && crisis),
      },
    ];

    if (!stages[this._currentStageIndex]) {
      return null;
    }

    for (let i = this._currentStageIndex + 1; i < stages.length; i++) {
      if (!stages[i].condition || stages[i].condition!()) {
        this._currentStageIndex = i;
        break;
      }
    }

    if (!stages[this._currentStageIndex]) {
      return null;
    }

    const nextStage = stages[this._currentStageIndex].factory();
    return nextStage;
  }

  get nextStageIndex() {
    return this._currentStageIndex;
  }

  toJSON() {
    return {
      nextStageIndex: this._currentStageIndex,
    };
  }

  static fromJSON(data: ReturnType<StageQueue['toJSON']>) {
    return new StageQueue(data.nextStageIndex);
  }
}
