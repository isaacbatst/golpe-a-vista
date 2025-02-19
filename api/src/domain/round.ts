import { CrisisStageFactory } from 'src/domain/stage/crisis-stage.factory';
import { DossierStageFactory } from 'src/domain/stage/dossier-stage.factory';
import { ImpeachmentStageFactory } from 'src/domain/stage/impeachment-stage.factory';
import { LegislativeStageFactory } from 'src/domain/stage/legislative-stage.factory';
import { RadicalizationStageFactory } from 'src/domain/stage/radicalization-stage.factory';
import { SabotageStageFactory } from 'src/domain/stage/sabotage-stage.factory';
import { Law } from '../data/laws';
import { Crisis } from './crisis/crisis';
import { CrisisEffectFactory } from './crisis/crisis-effect-factory';
import { Either, left, right } from './either';
import { Player } from './player';
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
  legislativeForcedVotes?: Map<string, boolean>;
};

export class Round {
  public readonly presidentQueue: PresidentQueue;
  public readonly index: number;
  public isDossierFake: boolean = false;
  public isDossierOmitted: boolean = false;
  public isLegislativeVotingSecret: boolean = false;
  public requiredVeto: LawType | null = null;

  private readonly _crisis: Crisis | null;
  private readonly _rapporteurId: string | null;
  private readonly _hasImpeachment: boolean;
  private readonly _hasLastRoundBeenSabotaged: boolean;
  private readonly _minRadicalizationConservativeLaws: number;
  private readonly _minRadicalizationProgressiveLaws: number;
  private readonly _previouslyApprovedConservativeLaws: number;
  private readonly _previouslyApprovedProgressiveLaws: number;
  private readonly _stages: Stage[] = [];
  private readonly _stageQueue: StageQueue;
  readonly legislativeForcedVotes: Map<string, boolean>;
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
    this.legislativeForcedVotes =
      props.legislativeForcedVotes ?? new Map<string, boolean>();
    this._stageQueue = props.stageQueue ?? new StageQueue();
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
      new ImpeachmentStageFactory(this.president.id, this._hasImpeachment),
      new CrisisStageFactory(this._crisis),
      new LegislativeStageFactory(
        this.requiredVeto,
        this.isLegislativeVotingSecret,
      ),
      new DossierStageFactory(this.drawnLaws, this.isDossierFake),
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

    return legislativeStages
      .filter(
        (stage) => stage.isComplete && stage.votingResult && stage.lawToVote,
      )
      .map((stage) => stage.lawToVote!);
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

  get nextRapporteur(): string | null {
    const dossierStage = this._stages.find(
      (stage): stage is DossierStage => stage instanceof DossierStage,
    );

    return dossierStage?.nextRapporteur ?? null;
  }

  get rapporteurId(): string | null {
    return this._rapporteurId;
  }

  get president(): Player {
    return this.presidentQueue.getByRoundNumber(this.index);
  }

  get nextPresident(): Player {
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
      president: this.president.toJSON(),
      nextPresident: this.nextPresident.toJSON(),
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
      legislativeForcedVotes: Array.from(this.legislativeForcedVotes),
      stageQueue: this._stageQueue.toJSON(),
    };
  }

  static fromJSON(
    json: ReturnType<Round['toJSON']>,
    presidentQueue: PresidentQueue,
  ): Round {
    const round = new Round({
      ...json,
      stageQueue: StageQueue.fromJSON(json.stageQueue),
      crisis: json.crisis
        ? Crisis.fromJSON(json.crisis, CrisisEffectFactory)
        : null,
      presidentQueue,
      legislativeForcedVotes: new Map(json.legislativeForcedVotes),
      rapporteurId: json.rapporteur ?? null,
      stages: json.stages.map((stage) => StageFactory.fromJSON(stage)),
    });
    return round;
  }
}
