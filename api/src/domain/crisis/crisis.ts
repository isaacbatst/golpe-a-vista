import { ActionController } from '../action-controller';
import { Random } from '../random';
import { Round } from '../round';

export enum CrisisVisibleTo {
  ALL = 'ALL',
  PRESIDENT = 'PRESIDENT',
  RAPPORTEUR = 'RAPPORTEUR',
}

type CrisisParams = {
  titles: readonly string[];
  description: string;
  actions?: ('ADVANDCE_STAGE' | (string & {}))[];
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

  abstract effect(round: Round): void;

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

  get actions(): readonly string[] | null {
    return this._actionController?.actions ?? null;
  }

  toJSON() {
    return {
      title: this.title,
      description: this.description,
      visibleTo: this.visibleTo,
      notVisibleTo: this.notVisibleTo,
      currentAction: this.currentAction,
      isComplete: this.isComplete,
      actions: this.actions,
    };
  }
}
