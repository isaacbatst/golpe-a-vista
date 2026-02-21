import { SabotageCardEffect } from 'src/domain/sabotage-card/sabotage-card-effect';
import { Random } from '../random';
import { SABOTAGE_CARD_NAMES } from './sabotage-card-names';
import { SabotageCardVisibleTo } from './sabotage-card-visible-to';
import { SabotageCardEffectFactory } from 'src/domain/sabotage-card/sabotage-card-effect-factory';
import { SabotageCardControlledBy } from 'src/domain/sabotage-card/sabotage-card-controlled-by';

export type SabotageCardParams = {
  name: SABOTAGE_CARD_NAMES;
  description: string;
  titles: readonly string[];
  title?: string;
  visibleTo?: SabotageCardVisibleTo[];
  notVisibleTo?: SabotageCardVisibleTo[];
  controlledBy: SabotageCardControlledBy[];
};

export type SabotageCardJSON = {
  name: SABOTAGE_CARD_NAMES;
  title: string;
  titles: readonly string[];
  description: string;
  visibleTo: SabotageCardVisibleTo[];
  notVisibleTo: SabotageCardVisibleTo[];
  controlledBy: SabotageCardControlledBy[];
};

export class SabotageCard {
  readonly cardType = 'SABOTAGE_CARD';
  readonly controlledBy: SabotageCardControlledBy[];
  private _name: SABOTAGE_CARD_NAMES;
  private _description: string;
  private _visibleTo: SabotageCardVisibleTo[];
  private _notVisibleTo: SabotageCardVisibleTo[];
  private _title: string;
  private _titles: readonly string[];

  constructor(params: SabotageCardParams) {
    this._description = params.description;
    this._name = params.name;
    this._titles = params.titles;
    this._visibleTo = params.visibleTo ?? [];
    this.controlledBy = params.controlledBy ?? [];
    this._notVisibleTo = params.notVisibleTo ?? [];
    this._title = params.title ?? Random.getFromArray(params.titles);
  }

  getEffect(): SabotageCardEffect {
    return SabotageCardEffectFactory.create(this._name);
  }

  get name(): SABOTAGE_CARD_NAMES {
    return this._name;
  }

  get title(): string {
    return this._title;
  }

  get description(): string {
    return this._description;
  }

  get visibleTo(): SabotageCardVisibleTo[] {
    return this._visibleTo;
  }

  get notVisibleTo(): SabotageCardVisibleTo[] {
    return this._notVisibleTo;
  }

  toJSON(): SabotageCardJSON {
    return {
      name: this.name,
      title: this.title,
      titles: this._titles,
      description: this.description,
      visibleTo: this.visibleTo,
      notVisibleTo: this.notVisibleTo,
      controlledBy: this.controlledBy,
    };
  }
}
