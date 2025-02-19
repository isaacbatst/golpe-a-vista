import { Law } from '../../data/laws';
import { Deck } from '../deck';
import { Either, left, right } from '../either';
import { Player } from '../player';
import { Stage, StageType } from './stage';

export enum DossierAction {
  SELECT_RAPPORTEUR = 'SELECT_RAPPORTEUR',
  PASS_DOSSIER = 'PASS_DOSSIER',
  ADVANCE_STAGE = 'ADVANCE_STAGE',
}

type DossierStageParams = {
  drawnLaws: Law[];
  fakeDossier?: boolean;
  currentAction?: DossierAction;
  isDossierVisibleToRapporteur?: boolean;
  nextRapporteurId?: string;
};

export class DossierStage extends Stage {
  readonly type = StageType.REPORT_DOSSIER;
  private _nextRapporteurId: string | null;
  private _isDossierVisibleToRapporteur: boolean;
  private _dossier: Law[];
  private _fakeDossier: boolean;

  constructor(params: DossierStageParams) {
    super(
      ['SELECT_RAPPORTEUR', 'PASS_DOSSIER', 'ADVANCE_STAGE'],
      params.currentAction,
    );
    this._dossier = params.drawnLaws;
    this._fakeDossier = params.fakeDossier ?? false;
    this._isDossierVisibleToRapporteur =
      params.isDossierVisibleToRapporteur ?? false;
    this._nextRapporteurId = params.nextRapporteurId ?? null;
  }

  chooseNextRapporteur(params: {
    issuerId?: string;
    chosen: Player;
    currentPresident: Player;
    currentRapporteur: Player | null;
    nextPresident: Player;
  }): Either<string, void> {
    const [error] = this.assertCurrentAction('SELECT_RAPPORTEUR');
    if (error) return left(error);

    params.issuerId = params.issuerId ?? params.currentPresident.id;

    if (params.issuerId !== params.currentPresident.id) {
      return left('Apenas o presidente pode escolher o relator');
    }

    const [canBeNextRapporteurError] = DossierStage.canBeNextRapporteur({
      chosen: params.chosen,
      currentPresident: params.currentPresident,
      nextPresident: params.nextPresident,
      currentRapporteur: params.currentRapporteur,
    });

    if (canBeNextRapporteurError) {
      return left(canBeNextRapporteurError);
    }

    this._nextRapporteurId = params.chosen.id;

    if (!params.currentRapporteur) {
      this.advanceAction(DossierAction.ADVANCE_STAGE);
      return right();
    }

    this.advanceAction();
    return right();
  }

  passDossier(
    lawsDeck: Deck<Law>,
    currentRapporteur: Player | null,
  ): Either<string, void> {
    const [error] = this.assertCurrentAction('PASS_DOSSIER');
    if (error) return left(error);

    if (!currentRapporteur) {
      return left('Nenhum relator foi escolhido.');
    }

    if (this._fakeDossier) {
      this._dossier = lawsDeck.show(3);
    }

    this._isDossierVisibleToRapporteur = true;
    this.advanceAction();
    return right();
  }

  get nextRapporteur(): string | null {
    return this._nextRapporteurId;
  }

  get isDossierVisibleToRapporteur(): boolean {
    return this._isDossierVisibleToRapporteur;
  }

  get dossier(): Law[] {
    return this._dossier;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      type: this.type,
      currentAction: this.currentAction as DossierAction,
      nextRapporteurId: this._nextRapporteurId,
      isDossierVisibleToRapporteur: this._isDossierVisibleToRapporteur,
      dossier: this._dossier.map((law) => law.toJSON()),
      drawnLaws: this._dossier.map((law) => law.toJSON()),
    } as const;
  }

  static fromJSON(data: ReturnType<DossierStage['toJSON']>) {
    return new DossierStage({
      ...data,
      nextRapporteurId: data.nextRapporteurId ?? undefined,
      drawnLaws: data.dossier.map((law) => Law.fromJSON(law)),
    });
  }

  static canBeNextRapporteur(params: {
    chosen: Player;
    currentPresident: Player;
    nextPresident: Player;
    currentRapporteur: Player | null;
  }): Either<string, true> {
    if (params.chosen.id === params.currentPresident.id) {
      return left('O presidente não pode ser o próximo relator');
    }
    if (params.currentRapporteur?.id === params.chosen.id) {
      return left('O relator atual não pode ser o próximo relator');
    }
    if (params.nextPresident.id === params.chosen.id) {
      return left('O próximo presidente não pode ser o relator');
    }
    if (params.chosen.impeached) {
      return left('O relator não pode ter sido cassado');
    }

    return right(true);
  }
}
