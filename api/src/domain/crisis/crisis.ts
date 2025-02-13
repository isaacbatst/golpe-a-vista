import { ActionController } from '../action-controller';
import { Random } from '../random';
import { Round } from '../round';
import { CRISIS_NAMES } from './crisis-names';
import { CrisisVisibleTo } from './crisis-visible-to.';
type CrisisAction = 'ADVANDCE_STAGE' | (string & {});

export type CrisisParams = {
  name: CRISIS_NAMES;
  description: string;
  actions?: CrisisAction[];
  currentAction?: CrisisAction;
  visibleTo?: CrisisVisibleTo[];
  notVisibleTo?: CrisisVisibleTo[];
  titles: readonly string[];
  title?: string;
};

export type CrisisJSON = {
  name: CRISIS_NAMES;
  title: string;
  titles: readonly string[];
  description: string;
  visibleTo: CrisisVisibleTo[];
  notVisibleTo: CrisisVisibleTo[];
  currentAction: CrisisAction | null;
  isComplete: boolean;
  actions: CrisisAction[] | null;
};

export abstract class Crisis {
  readonly cardType = 'CRISIS';
  private _name: CRISIS_NAMES;
  private _description: string;
  private _visibleTo: CrisisVisibleTo[];
  private _notVisibleTo: CrisisVisibleTo[];
  private _title: string;
  private _titles: readonly string[];
  protected _actionController: ActionController | null;

  constructor(params: CrisisParams) {
    this._description = params.description;
    this._name = params.name;
    this._titles = params.titles;
    this._visibleTo = params.visibleTo ?? [];
    this._notVisibleTo = params.notVisibleTo ?? [];
    this._title = params.title ?? Random.getFromArray(params.titles);
    this._actionController = params.actions
      ? new ActionController(params.actions, params.currentAction)
      : null;
  }

  abstract effect(round: Round): void;

  get name(): CRISIS_NAMES {
    return this._name;
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

  get actions(): CrisisAction[] | null {
    return this._actionController?.actions ?? null;
  }

  toJSON(): CrisisJSON {
    return {
      name: this.name,
      title: this.title,
      titles: this._titles,
      description: this.description,
      visibleTo: this.visibleTo,
      notVisibleTo: this.notVisibleTo,
      currentAction: this.currentAction,
      isComplete: this.isComplete,
      actions: this.actions,
    };
  }

  static fromJSON(
    data: CrisisJSON,
    factory: { fromJSON: (json: CrisisJSON) => Crisis },
  ) {
    return factory.fromJSON(data);
  }
}
