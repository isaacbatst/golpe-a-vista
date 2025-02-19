import { CrisisEffect } from 'src/domain/crisis/crisis-effect';
import { Random } from '../random';
import { CRISIS_NAMES } from './crisis-names';
import { CrisisVisibleTo } from './crisis-visible-to.';
import { CrisisEffectFactory } from 'src/domain/crisis/crisis-effect-factory';

export type CrisisParams = {
  name: CRISIS_NAMES;
  description: string;
  titles: readonly string[];
  title?: string;
  visibleTo?: CrisisVisibleTo[];
  notVisibleTo?: CrisisVisibleTo[];
};

export type CrisisJSON = {
  name: CRISIS_NAMES;
  title: string;
  titles: readonly string[];
  description: string;
  visibleTo: CrisisVisibleTo[];
  notVisibleTo: CrisisVisibleTo[];
};

export class Crisis {
  readonly cardType = 'CRISIS';
  private _name: CRISIS_NAMES;
  private _description: string;
  private _visibleTo: CrisisVisibleTo[];
  private _notVisibleTo: CrisisVisibleTo[];
  private _title: string;
  private _titles: readonly string[];

  constructor(params: CrisisParams) {
    this._description = params.description;
    this._name = params.name;
    this._titles = params.titles;
    this._visibleTo = params.visibleTo ?? [];
    this._notVisibleTo = params.notVisibleTo ?? [];
    this._title = params.title ?? Random.getFromArray(params.titles);
  }

  start(): CrisisEffect {
    return CrisisEffectFactory.create(this._name);
  }

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

  toJSON(): CrisisJSON {
    return {
      name: this.name,
      title: this.title,
      titles: this._titles,
      description: this.description,
      visibleTo: this.visibleTo,
      notVisibleTo: this.notVisibleTo,
    };
  }
}
