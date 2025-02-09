import { Either, left, right } from "./either";
import { Role } from "./role";

export class Player {
  constructor(
    private readonly _name: string,
    private readonly _role: Role,
    public impeached = false,
    private _radicalized = false
  ) {}

  radicalize(): Either<string, boolean> {
    if (this.impeached) {
      return left("Jogador cassado não pode ser radicalizado.");
    }

    if (this._role === Role.RADICAL) {
      return left("Jogador não pode ser radicalizado pois já é radical.");
    }
    if (this._radicalized) {
      return left("Jogador já foi radicalizado.");
    }

    if (this._role === Role.CONSERVADOR) {
      return right(false);
    }
    
    this._radicalized = true;
    return right(true);
  }

  get name() {
    return this._name;
  }

  get role() {
    return this._role;
  }

  get radicalized() {
    return this._radicalized;
  }
}
