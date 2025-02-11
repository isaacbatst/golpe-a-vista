export abstract class Law {
  private _name: string;
  private _description: string;

  abstract apply(): void;

  protected constructor(name: string, description: string) {
    this._name = name;
    this._description = description;
  }

  get name() {
    return this._name;
  }

  get description() {
    return this._description;
  }
}
