import { Random } from "../random";

export enum CrisisVisibleTo {
  ALL = "ALL",
  PRESIDENT = "PRESIDENT",
  RAPPORTEUR = "RAPPORTEUR"
}

export class Crisis {
  private _description: string;
  private _type: CrisisVisibleTo[];
  private _title: string;

  constructor(
    titles: readonly string[],
    description: string,
    visibleTo: CrisisVisibleTo[]
  ) {
    this._description = description;
    this._type = visibleTo;
    this._title = Random.getFromArray(titles);
  }

  get title(): string {
    return this._title;
  }

  get description(): string {
    return this._description;
  }

  get type(): CrisisVisibleTo[] {
    return this._type;
  }
}
