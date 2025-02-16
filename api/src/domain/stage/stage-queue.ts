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
  hasImpeachment?: boolean;
  drawnLaws?: Law[];
  hasApprovedProgressiveLaw?: boolean;
  hasMinLawsToRadicalization?: boolean;
  isDossierFake?: boolean;
  isLegislativeVotingSecret?: boolean;
  requiredVeto?: LawType | null;
  hasLastRoundBeenSabotaged?: boolean;
};

export class StageQueue {
  constructor(private _nextStage: number = 0) {}

  nextStage({
    presidentId,
    crisis = null,
    hasImpeachment = false,
    drawnLaws = [],
    hasApprovedProgressiveLaw = false,
    hasMinLawsToRadicalization = false,
    isDossierFake = false,
    isLegislativeVotingSecret = false,
    requiredVeto = null,
    hasLastRoundBeenSabotaged = false,
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
          hasApprovedProgressiveLaw && !hasLastRoundBeenSabotaged,
      },
      {
        factory: () => new RadicalizationStage(),
        condition: () => Boolean(hasMinLawsToRadicalization && crisis),
      },
    ];

    for (let i = this._nextStage; i < stages.length; i++) {
      const passed = stages[i].condition ? stages[i].condition!() : true;
      if (passed) {
        this._nextStage = i;
        break;
      }
      if (i === stages.length - 1) {
        this._nextStage = i;
        return null;
      }
    }

    const nextStage = stages[this._nextStage].factory();
    this._nextStage++;
    return nextStage;
  }

  get nextStageIndex() {
    return this._nextStage;
  }

  toJSON() {
    return {
      nextStageIndex: this._nextStage,
    };
  }

  static fromJSON(data: ReturnType<StageQueue['toJSON']>) {
    return new StageQueue(data.nextStageIndex);
  }
}
