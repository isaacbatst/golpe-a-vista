import { CrisisFactory } from 'src/domain/crisis/crisis-factory';
import { CrisisStageFactory } from 'src/domain/stage/crisis-stage.factory';
import { DossierStageFactory } from 'src/domain/stage/dossier-stage.factory';
import { ImpeachmentStage } from 'src/domain/stage/impeachment-stage';
import { ImpeachmentStageFactory } from 'src/domain/stage/impeachment-stage.factory';
import { LegislativeProposal } from 'src/domain/stage/legislative-proposal';
import { LegislativeStageFactory } from 'src/domain/stage/legislative-stage.factory';
import { RadicalizationStageFactory } from 'src/domain/stage/radicalization-stage.factory';
import { SabotageStageFactory } from 'src/domain/stage/sabotage-stage.factory';
import { Law } from '../data/laws';
import { Crisis } from './crisis/crisis';
import { Either, left, right } from './either';
import { PresidentQueue } from './president-queue';
import { LawType } from './role';
import { DossierStage } from './stage/dossier-stage';
import { LegislativeStage } from './stage/legislative-stage';
import { SabotageStage } from './stage/sabotage-stage';
import { Stage } from './stage/stage';
import { StageQueue } from './stage/stage-queue';
import { StageFactory, StageJSON } from './stage/stage.factory';

export type RoundParams = {
  index?: number;
  crisis?: Crisis | null;
  rapporteurId?: string | null;
  hasImpeachment?: boolean;
  stages?: Stage[];
  hasLastRoundBeenSabotaged?: boolean;
  minRadicalizationConservativeLaws?: number;
  minRadicalizationProgressiveLaws?: number;
  previouslyApprovedConservativeLaws?: number;
  previouslyApprovedProgressiveLaws?: number;
  presidentQueue: PresidentQueue;
  isDossierFake?: boolean;
  isDossierOmitted?: boolean;
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
  public isDossierFake: boolean = false;
  public isDossierOmitted: boolean = false;
  public isLegislativeVotingSecret: boolean = false;
  public requiredVeto: LawType | null = null;
  public disablePreviousLaw: LawType | null = null;

  private readonly _crisis: Crisis | null;
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
    this._crisis = props.crisis ?? null;
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
    this.isDossierFake = props.isDossierFake ?? false;
    this.isDossierOmitted = props.isDossierOmitted ?? false;
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
      new CrisisStageFactory(this._crisis, this.index),
      new LegislativeStageFactory(
        this.requiredVeto,
        this.isLegislativeVotingSecret,
      ),
      new DossierStageFactory(
        this.legislativeProposals,
        this.isDossierFake,
        this.isRapporteurImpeached,
        this.isDossierOmitted,
      ),
      new SabotageStageFactory(
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

  get sabotageCrisis(): Crisis | null {
    const sabotageStage = this._stages.find(
      (stage): stage is SabotageStage => stage instanceof SabotageStage,
    );

    if (!sabotageStage) {
      return null;
    }

    return sabotageStage.selectedCrisis;
  }

  get crisis(): Crisis | null {
    return this._crisis;
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
    const dossierStage = this._stages.find(
      (stage): stage is DossierStage => stage instanceof DossierStage,
    );

    return dossierStage?.nextRapporteur ?? null;
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
      isDossierFake: this.isDossierFake,
      isDossierOmitted: this.isDossierOmitted,
      isLegislativeVotingSecret: this.isLegislativeVotingSecret,
      requiredVeto: this.requiredVeto,
      hasImpeachment: this._hasImpeachment,
      crisis: this._crisis?.toJSON(),
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
      crisis: json.crisis ? CrisisFactory.fromJSON(json.crisis) : null,
      presidentQueue,
      mirroedVotes: new Map(json.mirroedVotes),
      rapporteurId: json.rapporteur ?? null,
      stages: json.stages.map((stage) => StageFactory.fromJSON(stage)),
    });
    return round;
  }
}
