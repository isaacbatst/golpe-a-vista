import { Law } from "../data/laws";
import { Crisis } from "./crisis";
import { Deck } from "./deck";
import { Either, left, right } from "./either";
import { Player } from "./player";
import { LawType } from "./role";
import { DossierStage } from "./stage/dossier-stage";
import { ImpeachmentStage } from "./stage/impeachment-stage";
import { LegislativeStage } from "./stage/legislative-stage";
import { RadicalizationStage } from "./stage/radicalization-stage";
import { SabotageStage } from "./stage/sabotage-stage";
import { Stage } from "./stage/stage";

type RoundParams = {
  president: Player;
  nextPresident: Player;
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
};

export class Round {
  public isDossierVisibleToRapporteur = false;
  public readonly president: Player;
  private readonly _lawsDeck: Deck<Law>;
  private readonly _nextPresident: Player;
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
    this.president = props.president;
    this._crisesDeck = props.crisesDeck;
    this._crisis = props.crisis ?? null;
    this._lawsDeck = props.lawsDeck;
    this._hasImpeachment = props.hasImpeachment ?? false;
    this._rapporteur = props.rapporteur ?? null;
    this._nextPresident = props.nextPresident;
    this._hasLastRoundBeenSabotaged = props.hasLastRoundBeenSabotaged ?? false;
    this._minRadicalizationConservativeLaws =
      props.minRadicalizationConservativeLaws ?? 4;
    this._minRadicalizationProgressiveLaws =
      props.minRadicalizationProgressiveLaws ?? 4;
    this._previouslyApprovedConservativeLaws =
      props.previouslyApprovedConservativeLaws ?? 0;
    this._previouslyApprovedProgressiveLaws =
      props.previouslyApprovedProgressiveLaws ?? 0;
    this._stages = props.stages ?? [this.createFirstStage()];
  }

  nextStage(): Either<string, Stage | null> {
    if (!this.currentStage.isComplete) {
      return left("Estágio atual não finalizado");
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

    return new LegislativeStage(this._lawsDeck);
  }

  private createNextStage(): Stage | null {
    if (this.currentStage instanceof ImpeachmentStage) {
      return new LegislativeStage(this._lawsDeck);
    }

    if (this.currentStage instanceof LegislativeStage) {
      return new DossierStage(
        this.president,
        this._nextPresident,
        this._rapporteur
      );
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
      (stage): stage is LegislativeStage => stage instanceof LegislativeStage
    );

    const conservativeLaws = legislativeStages.filter(
      (stage) => stage.lawToVote?.type === LawType.CONSERVADORES
    ).length;
    const progressiveLaws = legislativeStages.filter(
      (stage) => stage.lawToVote?.type === LawType.PROGRESSISTAS
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
      (stage): stage is LegislativeStage => stage instanceof LegislativeStage
    );

    return legislativeStages.some(
      (stage) => stage.lawToVote?.type === type && stage.votingResult
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
      (stage): stage is LegislativeStage => stage instanceof LegislativeStage
    );

    return legislativeStages
      .filter(
        (stage) => stage.isComplete && stage.votingResult && stage.lawToVote
      )
      .map((stage) => stage.lawToVote!);
  }

  get rejectedLaws(): Law[] {
    const legislativeStages = this._stages.filter(
      (stage): stage is LegislativeStage => stage instanceof LegislativeStage
    );

    return legislativeStages
      .filter(
        (stage) => stage.isComplete && !stage.votingResult && stage.lawToVote
      )
      .map((stage) => stage.lawToVote!);
  }

  get hasRejectedLaw(): boolean {
    const legislativeStages = this._stages.filter(
      (stage): stage is LegislativeStage => stage instanceof LegislativeStage
    );

    return legislativeStages.some(
      (stage) => stage.isComplete && !stage.votingResult && stage.lawToVote
    );
  }

  get sabotageCrisis(): Crisis | null {
    const sabotageStage = this._stages.find(
      (stage): stage is SabotageStage => stage instanceof SabotageStage
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
}
