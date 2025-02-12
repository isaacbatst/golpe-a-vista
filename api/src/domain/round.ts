import { Law } from '../data/laws';
import { Crisis } from './crisis/crisis';
import { Deck } from './deck';
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

export type RoundParams = {
  index?: number;
  lawsDeck: Deck<Law>;
  crisesDeck: Deck<Crisis>;
  crisis?: Crisis | null;
  rapporteur?: Player | null;
  hasImpeachment?: boolean;
  stages?: Stage[];
  hasLastRoundBeenSabotaged?: boolean;
  minRadicalizationConservativeLaws?: number;
  minRadicalizationProgressiveLaws?: number;
  previouslyApprovedConservativeLaws?: number;
  previouslyApprovedProgressiveLaws?: number;
  presidentQueue: PresidentQueue;
};

export class Round {
  public readonly presidentQueue: PresidentQueue;
  public readonly index: number;
  public isDossierFake: boolean = false;
  public isDossierOmitted: boolean = false;
  public isLegislativeVotingSecret: boolean = false;
  public requiredVeto: LawType | null = null;

  private readonly _lawsDeck: Deck<Law>;
  private readonly _crisesDeck: Deck<Crisis>;
  private readonly _crisis: Crisis | null;
  private readonly _rapporteur: Player | null;
  private readonly _hasImpeachment: boolean;
  private readonly _hasLastRoundBeenSabotaged: boolean;
  private readonly _minRadicalizationConservativeLaws: number;
  private readonly _minRadicalizationProgressiveLaws: number;
  private readonly _previouslyApprovedConservativeLaws: number;
  private readonly _previouslyApprovedProgressiveLaws: number;
  private readonly _stages: Stage[];

  constructor(props: RoundParams) {
    this._crisesDeck = props.crisesDeck;
    this._crisis = props.crisis ?? null;
    this._lawsDeck = props.lawsDeck;
    this._hasImpeachment = props.hasImpeachment ?? false;
    this._rapporteur = props.rapporteur ?? null;
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
      lawsDeck: this._lawsDeck,
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
        lawsDeck: this._lawsDeck,
        mustVeto: this.requiredVeto,
        isVotingSecret: this.isLegislativeVotingSecret,
      });
    }

    if (this.currentStage instanceof LegislativeStage) {
      return new DossierStage({
        currentPresident: this.president,
        currentRapporteur: this._rapporteur,
        drawnLaws: this.currentStage.drawnLaws,
        nextPresident: this.nextPresident,
        fakeDossier: this.isDossierFake,
        lawsDeck: this._lawsDeck,
      });
    }

    if (
      this.currentStage instanceof DossierStage &&
      this.hasApprovedLaw(LawType.PROGRESSISTAS) &&
      !this._hasLastRoundBeenSabotaged
    ) {
      return new SabotageStage(this._crisesDeck);
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

  get nextRapporteur(): Player | null {
    const dossierStage = this._stages.find(
      (stage): stage is DossierStage => stage instanceof DossierStage,
    );

    return dossierStage?.nextRapporteur ?? null;
  }

  get rapporteur(): Player | null {
    return this._rapporteur;
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
      stages: this._stages.map((stage) => stage.toJSON()),
      isDossierFake: this.isDossierFake,
      isDossierOmitted: this.isDossierOmitted,
      isLegislativeVotingSecret: this.isLegislativeVotingSecret,
      requiredVeto: this.requiredVeto,
      hasImpeachment: this._hasImpeachment,
      crisis: this._crisis?.toJSON(),
      rapporteur: this._rapporteur?.toJSON(),
      president: this.president.toJSON(),
      nextPresident: this.nextPresident.toJSON(),
      finished: this.finished,
      currentStage: this.currentStage.toJSON(),
    };
  }
}
