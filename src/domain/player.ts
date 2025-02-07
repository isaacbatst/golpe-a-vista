import { Role } from "./role";

export class Player {
  constructor(private readonly _name: string, private readonly _role: Role, public impeached = false) {}

  get name() {
    return this._name;
  }

  get role() {
    return this._role;
  }
}
