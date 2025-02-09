import { Random } from "./random";

export enum CrisisType {
  PUBLICA = "Pública",
  OCULTA = "Oculta",
}

export class Crisis {
  private _description: string;
  private _type: CrisisType;
  private _title: string;

  constructor(
    titles: readonly string[],
    description: string,
    type: CrisisType
  ) {
    this._description = description;
    this._type = type;
    this._title = Random.getFromArray(titles);
  }

  get title(): string {
    return this._title;
  }

  get description(): string {
    return this._description;
  }

  get type(): CrisisType {
    return this._type;
  }
}
