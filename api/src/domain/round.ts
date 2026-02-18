import { SabotageCardFactory } from 'src/domain/sabotage-card/sabotage-card-factory';
import { SabotageCardStageFactory } from 'src/domain/stage/sabotage-card-stage.factory';
import { CPIStageFactory } from 'src/domain/stage/cpi-stage.factory';
import { ImpeachmentStage } from 'src/domain/stage/impeachment-stage';
import { ImpeachmentStageFactory } from 'src/domain/stage/impeachment-stage.factory';
import { LegislativeProposal } from 'src/domain/stage/legislative-proposal';
import { LegislativeStageFactory } from 'src/domain/stage/legislative-stage.factory';
import { RadicalizationStageFactory } from 'src/domain/stage/radicalization-stage.factory';
import { InterceptionStageFactory } from 'src/domain/stage/interception-stage.factory';
import { Law } from '../data/laws';
import { SabotageCard } from './sabotage-card/sabotage-card';
import { Either, left, right } from './either';
import { PresidentQueue } from './president-queue';
import { LawType } from './role';
import { CPIStage } from './stage/cpi-stage';
import { LegislativeStage } from './stage/legislative-stage';
import { InterceptionStage } from './stage/interception-stage';
import { Stage } from './stage/stage';
import { StageQueue } from './stage/stage-queue';
import { StageFactory, StageJSON } from './stage/stage.factory';

export type RoundParams = {
  index?: number;
  sabotageCard?: SabotageCard | null;
  rapporteurId?: string | null;
  hasImpeachment?: boolean;
  stages?: Stage[];
  hasLastRoundBeenSabotaged?: boolean;
  minRadicalizationConservativeLaws?: number;
  minRadicalizationProgressiveLaws?: number;
  previouslyApprovedConservativeLaws?: number;
  previouslyApprovedProgressiveLaws?: number;
  presidentQueue: PresidentQueue;
  isObstructed?: boolean;
  isCPIOmitted?: boolean;
  isLegislativeVotingSecret?: boolean;
  requiredVeto?: LawType | null;
  stageQueue?: StageQueue;
  mirroedVotes?: Map<string, string>;
  previouslyImpeachedSomeConservative?: boolean;
  previouslyImpeachedRadical?: boolean;
  disablePreviousLaw?: LawType | null;
};

export class Round {
  public readonly presidentQueue: PresidentQueue;
  public readonly index: number;
  public isObstructed: boolean = false;
  public isCPIOmitted: boolean = false;
  public isLegislativeVotingSecret: boolean = false;
  public requiredVeto: LawType | null = null;
  public disablePreviousLaw: LawType | null = null;

  private readonly _sabotageCard: SabotageCard | null;
  private readonly _rapporteurId: string | null;
  private readonly _hasImpeachment: boolean;
  private readonly _hasLastRoundBeenSabotaged: boolean;
  private readonly _minRadicalizationConservativeLaws: number;
  private readonly _minRadicalizationProgressiveLaws: number;
  private readonly _previouslyApprovedConservativeLaws: number;
  private readonly _previouslyApprovedProgressiveLaws: number;
  private readonly _previouslyImpeachedSomeConservative: boolean;
  private readonly _previouslyImpeachedRadical: boolean;
  private readonly _stages: Stage[] = [];
  private readonly _stageQueue: StageQueue;
  readonly mirroedVotes: Map<string, string>;
  constructor(props: RoundParams) {
    this._sabotageCard = props.sabotageCard ?? null;
    this._hasImpeachment = props.hasImpeachment ?? false;
    this._rapporteurId = props.rapporteurId ?? null;
    this._hasLastRoundBeenSabotaged = props.hasLastRoundBeenSabotaged ?? false;
    this._minRadicalizationConservativeLaws =
      props.minRadicalizationConservativeLaws ?? 4;
    this._minRadicalizationProgressiveLaws =
      props.minRadicalizationProgressiveLaws ?? 4;
    this._previouslyApprovedConservativeLaws =
      props.previouslyApprovedConservativeLaws ?? 0;
    this._previouslyApprovedProgressiveLaws =
      props.previouslyApprovedProgressiveLaws ?? 0;
    this.index = props.index ?? 0;
    this.presidentQueue = props.presidentQueue;
    this.mirroedVotes = props.mirroedVotes ?? new Map<string, string>();
    this._stageQueue = props.stageQueue ?? new StageQueue();
    this._previouslyImpeachedSomeConservative =
      props.previouslyImpeachedSomeConservative ?? false;
    this._previouslyImpeachedRadical =
      props.previouslyImpeachedRadical ?? false;
    this.isObstructed = props.isObstructed ?? false;
    this.isCPIOmitted = props.isCPIOmitted ?? false;
    this.disablePreviousLaw = props.disablePreviousLaw ?? null;
    this._stages = props.stages ?? [this.createFirstStage()];
  }

  nextStage(): Either<string, Stage | null> {
    if (!this.currentStage.isComplete) {
      return left('Estágio atual não finalizado');
    }

    const next = this.pushNextStage();

    if (!next) {
      return right(null);
    }

    this._stages.push(next);
    return right(next);
  }

  private createFirstStage(): Stage {
    return this.pushNextStage()!;
  }

  pushNextStage(): Stage | null {
    return this._stageQueue.nextStage(this.stageFactories);
  }

  hasApprovedLaw(type: LawType): boolean {
    const legislativeStages = this._stages.filter(
      (stage): stage is LegislativeStage => stage instanceof LegislativeStage,
    );

    return legislativeStages.some(
      (stage) => stage.lawToVote?.type === type && stage.votingResult,
    );
  }

  totalApprovedLaws(type: LawType): number {
    const legislativeStages = this._stages.filter(
      (stage): stage is LegislativeStage => stage instanceof LegislativeStage,
    );

    const approvedThisRound = legislativeStages.filter(
      (stage) => stage.lawToVote?.type === type && stage.votingResult,
    ).length;

    return this.previouslyApprovedLaws(type) + approvedThisRound;
  }

  previouslyApprovedLaws(type: LawType): number {
    if (type === LawType.CONSERVADORES) {
      return this._previouslyApprovedConservativeLaws;
    }

    return this._previouslyApprovedProgressiveLaws;
  }

  get currentStage(): Stage {
    return this._stages[this._stages.length - 1];
  }

  get stageFactories(): StageFactory[] {
    return [
      new ImpeachmentStageFactory(
        this.presidentId,
        this._hasImpeachment,
        this._previouslyImpeachedSomeConservative,
        this._previouslyImpeachedRadical,
      ),
      new SabotageCardStageFactory(this._sabotageCard, this.index),
      new LegislativeStageFactory(
        this.requiredVeto,
        this.isLegislativeVotingSecret,
      ),
      new CPIStageFactory(
        this.legislativeProposals,
        this.isObstructed,
        this.isRapporteurImpeached,
        this.isCPIOmitted,
      ),
      new InterceptionStageFactory(
        this.hasApprovedLaw(LawType.PROGRESSISTAS),
        this._hasLastRoundBeenSabotaged,
      ),
      new RadicalizationStageFactory(
        this.totalApprovedLaws(LawType.CONSERVADORES),
        this.totalApprovedLaws(LawType.PROGRESSISTAS),
        this._minRadicalizationConservativeLaws,
        this._minRadicalizationProgressiveLaws,
      ),
    ];
  }

  get isRapporteurImpeached(): boolean {
    const impeachments = this._stages.filter(
      (stage): stage is ImpeachmentStage => stage instanceof ImpeachmentStage,
    );

    return impeachments.some(
      (stage) =>
        stage.target &&
        stage.target === this._rapporteurId &&
        (stage.shouldSkipVoting || stage.voting?.result),
    );
  }

  get finished(): boolean {
    return (
      this.currentStage.isComplete &&
      this._stageQueue.isFinished(this.stageFactories)
    );
  }

  get approvedLaws(): Law[] {
    const legislativeStages = this._stages.filter(
      (stage): stage is LegislativeStage => stage instanceof LegislativeStage,
    );
    const impeachments = this._stages.filter(
      (stage): stage is ImpeachmentStage => stage instanceof ImpeachmentStage,
    );

    return [
      ...impeachments.filter((s) => s.approvedLaw).map((s) => s.approvedLaw!),
      ...legislativeStages
        .filter(
          (stage) => stage.isComplete && stage.votingResult && stage.lawToVote,
        )
        .map((stage) => stage.lawToVote!),
    ];
  }

  get rejectedLaws(): Law[] {
    const legislativeStages = this._stages.filter(
      (stage): stage is LegislativeStage => stage instanceof LegislativeStage,
    );

    return legislativeStages
      .filter(
        (stage) => stage.isComplete && !stage.votingResult && stage.lawToVote,
      )
      .map((stage) => stage.lawToVote!);
  }

  get hasRejectedLaw(): boolean {
    const legislativeStages = this._stages.filter(
      (stage): stage is LegislativeStage => stage instanceof LegislativeStage,
    );

    return legislativeStages.some(
      (stage) => stage.isComplete && !stage.votingResult && stage.lawToVote,
    );
  }

  get interceptionSabotageCard(): SabotageCard | null {
    const sabotageStage = this._stages.find(
      (stage): stage is InterceptionStage => stage instanceof InterceptionStage,
    );

    if (!sabotageStage) {
      return null;
    }

    return sabotageStage.selectedSabotageCard;
  }

  get sabotageCard(): SabotageCard | null {
    return this._sabotageCard;
  }

  get hasImpeachment(): boolean {
    return this._hasImpeachment;
  }

  get drawnLaws(): Law[] {
    return this._stages
      .filter(
        (stage): stage is LegislativeStage => stage instanceof LegislativeStage,
      )
      .flatMap((stage) => stage.drawnLaws);
  }

  get legislativeProposals(): LegislativeProposal[] {
    return this._stages
      .filter(
        (stage): stage is LegislativeStage => stage instanceof LegislativeStage,
      )
      .flatMap((stage) => stage.proposals);
  }

  get nextRapporteur(): string | null {
    const cpiStage = this._stages.find(
      (stage): stage is CPIStage => stage instanceof CPIStage,
    );

    return cpiStage?.nextRapporteur ?? null;
  }

  get rapporteurId(): string | null {
    return this._rapporteurId;
  }

  get presidentId(): string {
    return this.presidentQueue.getByRoundNumber(this.index);
  }

  get nextPresidentId(): string {
    return this.presidentQueue.getByRoundNumber(this.index + 1);
  }

  toJSON() {
    return {
      index: this.index,
      stages: this._stages.map((stage) => stage.toJSON() as StageJSON),
      isObstructed: this.isObstructed,
      isCPIOmitted: this.isCPIOmitted,
      isLegislativeVotingSecret: this.isLegislativeVotingSecret,
      requiredVeto: this.requiredVeto,
      hasImpeachment: this._hasImpeachment,
      sabotageCard: this._sabotageCard?.toJSON(),
      rapporteur: this._rapporteurId,
      president: this.presidentId,
      nextPresident: this.nextPresidentId,
      finished: this.finished,
      currentStage: this.currentStage.toJSON(),
      hasLastRoundBeenSabotaged: this._hasLastRoundBeenSabotaged,
      minRadicalizationConservativeLaws:
        this._minRadicalizationConservativeLaws,
      minRadicalizationProgressiveLaws: this._minRadicalizationProgressiveLaws,
      previouslyApprovedConservativeLaws:
        this._previouslyApprovedConservativeLaws,
      previouslyApprovedProgressiveLaws:
        this._previouslyApprovedProgressiveLaws,
      presidentQueue: this.presidentQueue.toJSON(),
      mirroedVotes: Array.from(this.mirroedVotes),
      stageQueue: this._stageQueue.toJSON(),
      previouslyImpeachedSomeConservative:
        this._previouslyImpeachedSomeConservative,
      previouslyImpeachedRadical: this._previouslyImpeachedRadical,
      disablePreviousLaw: this.disablePreviousLaw,
    };
  }

  static fromJSON(
    json: ReturnType<Round['toJSON']>,
    presidentQueue: PresidentQueue,
  ): Round {
    const round = new Round({
      ...json,
      stageQueue: StageQueue.fromJSON(json.stageQueue),
      sabotageCard: json.sabotageCard ? SabotageCardFactory.fromJSON(json.sabotageCard) : null,
      presidentQueue,
      mirroedVotes: new Map(json.mirroedVotes),
      rapporteurId: json.rapporteur ?? null,
      stages: json.stages.map((stage) => StageFactory.fromJSON(stage)),
    });
    return round;
  }
}
