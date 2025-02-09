import { Either, left, right } from "../either";
import { Player } from "../player";
import { Stage, StageType } from "./stage";

export enum DossierAction {
  SELECT_RAPPORTEUR = "SELECT_RAPPORTEUR",
  PASS_DOSSIER = "PASS_DOSSIER",
  ADVANCE_STAGE = "ADVANCE_STAGE",
}

export class DossierStage extends Stage {
  readonly type = StageType.REPORT_DOSSIER;
  private _nextRapporteur: Player | null = null;
  private _isDossierVisibleToRapporteur = false;

  constructor(
    private _currentPresident: Player,
    private _nextPresident: Player,
    private _currentRapporteur: Player | null
  ) {
    super(["SELECT_RAPPORTEUR", "PASS_DOSSIER", "ADVANCE_STAGE"]);
  }

  chooseNextRapporteur(player: Player): Either<string, void> {
    const [error] = this.assertCurrentAction("SELECT_RAPPORTEUR");
    if (error) return left(error);

    if (this._currentPresident === player) {
      return left("O presidente não pode ser o próximo relator");
    }

    if (this._currentRapporteur === player) {
      return left("O relator anterior não pode ser o relator");
    }

    if (this._nextPresident === player) {
      return left("O próximo presidente não pode ser o relator");
    }

    if (player.impeached) {
      return left("O relator não pode ter sido cassado");
    }

    this._nextRapporteur = player;
    this.advanceAction();
    return right();
  }

  passDossier(): Either<string, void> {
    const [error] = this.assertCurrentAction("PASS_DOSSIER");
    if (error) return left(error);

    if (!this._nextRapporteur) {
      return left("Nenhum relator foi escolhido.");
    }

    this._isDossierVisibleToRapporteur = true;
    this.advanceAction();
    return right();
  }

  get nextRapporteur(): Player | null {
    return this._nextRapporteur;
  }

  get isDossierVisibleToRapporteur(): boolean {
    return this._isDossierVisibleToRapporteur;
  }
}
