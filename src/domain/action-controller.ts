import { Either, left, right } from "./either";

export class ActionController {
  public currentAction: string;
  private _actions: string[];

  constructor(actions: string[], currentAction: string = actions[0]) {
    this._actions = actions;
    this.currentAction = currentAction;
  }

  assertCurrentAction(action: string): Either<string, void> {
    if (this.currentAction !== action) {
      return left(ActionController.unexpectedActionMessage(action, this.currentAction));
    }
    return right();
  }

  advanceAction(): void {
    const currentIndex = this._actions.indexOf(this.currentAction);
    this.currentAction = this._actions[currentIndex + 1] ?? this._actions[this._actions.length - 1];
  }

  get isComplete(): boolean {
    return this.currentAction === this._actions[this._actions.length - 1];
  }

  static unexpectedActionMessage(unexpected: string, expected: string): string {
    return `Ação inválida: ${unexpected}. Ação esperada: ${expected}.`;
  }
}