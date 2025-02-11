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
  currentPresident: Player;
  nextPresident: Player;
  currentRapporteur: Player | null;
  drawnLaws: Law[];
  lawsDeck: Deck<Law>;
  fakeDossier?: boolean;
  currentAction?: DossierAction;
};

export class DossierStage extends Stage {
  readonly type = StageType.REPORT_DOSSIER;
  private _nextRapporteur: Player | null = null;
  private _isDossierVisibleToRapporteur = false;
  private _currentPresident: Player;
  private _nextPresident: Player;
  private _currentRapporteur: Player | null;
  private _drawnLaws: Law[];
  private _lawsDeck: Deck<Law>;
  private _fakeDossier: boolean;

  constructor(params: DossierStageParams) {
    super(
      ['SELECT_RAPPORTEUR', 'PASS_DOSSIER', 'ADVANCE_STAGE'],
      params.currentAction,
    );
    this._currentPresident = params.currentPresident;
    this._nextPresident = params.nextPresident;
    this._currentRapporteur = params.currentRapporteur;
    this._drawnLaws = params.drawnLaws;
    this._lawsDeck = params.lawsDeck;
    this._fakeDossier = params.fakeDossier ?? false;
  }

  chooseNextRapporteur(player: Player): Either<string, void> {
    const [error] = this.assertCurrentAction('SELECT_RAPPORTEUR');
    if (error) return left(error);

    if (this._currentPresident === player) {
      return left('O presidente não pode ser o próximo relator');
    }

    if (this._currentRapporteur === player) {
      return left('O relator anterior não pode ser o relator');
    }

    if (this._nextPresident === player) {
      return left('O próximo presidente não pode ser o relator');
    }

    if (player.impeached) {
      return left('O relator não pode ter sido cassado');
    }

    this._nextRapporteur = player;
    this.advanceAction();
    return right();
  }

  passDossier(): Either<string, void> {
    const [error] = this.assertCurrentAction('PASS_DOSSIER');
    if (error) return left(error);

    if (!this._nextRapporteur) {
      return left('Nenhum relator foi escolhido.');
    }

    this._isDossierVisibleToRapporteur = true;
    this.advanceAction();
    return right();
  }

  get dossier(): Law[] {
    if (this._fakeDossier) {
      return this._lawsDeck.show(3);
    }

    return this._drawnLaws;
  }

  get nextRapporteur(): Player | null {
    return this._nextRapporteur;
  }

  get isDossierVisibleToRapporteur(): boolean {
    return this._isDossierVisibleToRapporteur;
  }
}
