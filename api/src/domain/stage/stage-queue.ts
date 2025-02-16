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
  constructor(private _nextStageIndex: number = 0) {}

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

    if (!stages[this._nextStageIndex]) {
      return null;
    }

    while (
      this._nextStageIndex < stages.length &&
      stages[this._nextStageIndex].condition &&
      !stages[this._nextStageIndex].condition!()
    ) {
      this._nextStageIndex++;
    }

    if (!stages[this._nextStageIndex]) {
      return null;
    }

    const nextStage = stages[this._nextStageIndex].factory();
    this._nextStageIndex++;
    return nextStage;
  }

  get nextStageIndex() {
    return this._nextStageIndex;
  }

  toJSON() {
    return {
      nextStageIndex: this._nextStageIndex,
    };
  }

  static fromJSON(data: ReturnType<StageQueue['toJSON']>) {
    return new StageQueue(data.nextStageIndex);
  }
}
