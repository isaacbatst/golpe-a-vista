import { Law } from '../data/laws';
import { Crisis } from './crisis/crisis';
import { CrisisFactory } from './crisis/crisis-factory';
import { Either, left, right } from './either';
import { Player } from './player';
import { PresidentQueue } from './president-queue';
import { LawType } from './role';
import { CrisisStage } from './stage/crisis-stage';
import { DossierStage } from './stage/dossier-stage';
import { ImpeachmentStage } from './stage/impeachment-stage';
import { LegislativeStage } from './stage/legislative-stage';
import { RadicalizationStage } from './stage/radicalization-stage';
import { SabotageStage } from './stage/sabotage-stage';
import { Stage } from './stage/stage';
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
  private readonly _stages: Stage[];

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
    this._stages = props.stages ?? [this.createFirstStage()];
  }

  nextStage(): Either<string, Stage | null> {
    if (!this.currentStage.isComplete) {
      return left('Estágio atual não finalizado');
    }

    const next = this.createNextStage();

    if (!next) {
      return right(null);
    }

    this._stages.push(next);
    return right(next);
  }

  private createFirstStage(): Stage {
    if (this._hasImpeachment) {
      return new ImpeachmentStage(this.president);
    }

    if (this._crisis) {
      return new CrisisStage(this._crisis);
    }

    return new LegislativeStage({
      mustVeto: this.requiredVeto,
      isVotingSecret: this.isLegislativeVotingSecret,
    });
  }

  private createNextStage(): Stage | null {
    if (this.currentStage instanceof ImpeachmentStage && this._crisis) {
      return new CrisisStage(this._crisis);
    }

    if (
      this.currentStage instanceof ImpeachmentStage ||
      this.currentStage instanceof CrisisStage
    ) {
      return new LegislativeStage({
        mustVeto: this.requiredVeto,
        isVotingSecret: this.isLegislativeVotingSecret,
      });
    }

    if (this.currentStage instanceof LegislativeStage) {
      return new DossierStage({
        drawnLaws: this.currentStage.drawnLaws,
        fakeDossier: this.isDossierFake,
      });
    }

    if (
      this.currentStage instanceof DossierStage &&
      this.hasApprovedLaw(LawType.PROGRESSISTAS) &&
      !this._hasLastRoundBeenSabotaged
    ) {
      return new SabotageStage();
    }

    if (
      this.currentStage instanceof DossierStage &&
      this.hasMinLawsToRadicalization() &&
      this._crisis
    ) {
      return new RadicalizationStage();
    }

    if (
      this.currentStage instanceof SabotageStage &&
      this.hasMinLawsToRadicalization() &&
      this._crisis
    ) {
      return new RadicalizationStage();
    }

    return null;
  }

  private hasMinLawsToRadicalization(): boolean {
    const legislativeStages = this._stages.filter(
      (stage): stage is LegislativeStage => stage instanceof LegislativeStage,
    );

    const conservativeLaws = legislativeStages.filter(
      (stage) => stage.lawToVote?.type === LawType.CONSERVADORES,
    ).length;
    const progressiveLaws = legislativeStages.filter(
      (stage) => stage.lawToVote?.type === LawType.PROGRESSISTAS,
    ).length;

    const totalConservativeLaws =
      this._previouslyApprovedConservativeLaws + conservativeLaws;
    const totalProgressiveLaws =
      this._previouslyApprovedProgressiveLaws + progressiveLaws;

    return (
      totalConservativeLaws >= this._minRadicalizationConservativeLaws ||
      totalProgressiveLaws >= this._minRadicalizationProgressiveLaws
    );
  }

  hasApprovedLaw(type: LawType): boolean {
    const legislativeStages = this._stages.filter(
      (stage): stage is LegislativeStage => stage instanceof LegislativeStage,
    );

    return legislativeStages.some(
      (stage) => stage.lawToVote?.type === type && stage.votingResult,
    );
  }

  get currentStage(): Stage {
    return this._stages[this._stages.length - 1];
  }

  get finished(): boolean {
    return this.createNextStage() === null;
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
    };
  }

  static fromJSON(
    json: ReturnType<Round['toJSON']>,
    presidentQueue: PresidentQueue,
  ): Round {
    const round = new Round({
      ...json,
      crisis: json.crisis ? Crisis.fromJSON(json.crisis, CrisisFactory) : null,
      presidentQueue,
      rapporteurId: json.rapporteur ?? null,
      stages: json.stages.map((stage) => StageFactory.fromJSON(stage)),
    });
    return round;
  }
}
