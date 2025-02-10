import { ActionController } from "../action-controller";
import { Random } from "../random";

export enum CrisisVisibleTo {
  ALL = "ALL",
  PRESIDENT = "PRESIDENT",
  RAPPORTEUR = "RAPPORTEUR",
}

type CrisisParams = {
  titles: readonly string[];
  description: string;
  actions?: ("ADVANDCE_STAGE" | (string & {}))[];
  currentAction?: string;
  visibleTo?: CrisisVisibleTo[];
  notVisibleTo?: CrisisVisibleTo[];
};

export abstract class Crisis {
  private _description: string;
  private _visibleTo: CrisisVisibleTo[];
  private _notVisibleTo: CrisisVisibleTo[];
  private _title: string;
  protected _actionController: ActionController | null;

  constructor(params: CrisisParams) {
    this._description = params.description;
    this._visibleTo = params.visibleTo ?? [];
    this._notVisibleTo = params.notVisibleTo ?? [];
    this._title = Random.getFromArray(params.titles);
    this._actionController = params.actions
      ? new ActionController(params.actions, params.currentAction)
      : null;
  }

  get title(): string {
    return this._title;
  }

  get description(): string {
    return this._description;
  }

  get visibleTo(): CrisisVisibleTo[] {
    return this._visibleTo;
  }

  get notVisibleTo(): CrisisVisibleTo[] {
    return this._notVisibleTo;
  }

  get currentAction(): string | null {
    return this._actionController?.currentAction ?? null;
  }

  get isComplete(): boolean {
    return this._actionController?.isComplete ?? true;
  }
}
