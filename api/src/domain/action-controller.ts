import { Either, left, right } from './either';

export class ActionController<T extends string = string> {
  public currentAction: T;
  private _actions: T[];

  constructor(actions: T[], currentAction: T = actions[0]) {
    this._actions = actions;
    this.currentAction = currentAction;
  }

  assertCurrentAction(action: T): Either<string, void> {
    if (this.currentAction !== action) {
      return left(
        ActionController.unexpectedActionMessage(action, this.currentAction),
      );
    }
    return right();
  }

  advanceAction(to?: T): void {
    if (to && this._actions.includes(to)) {
      this.currentAction = to;
      return;
    }
    const currentIndex = this._actions.indexOf(this.currentAction);
    this.currentAction =
      this._actions[currentIndex + 1] ??
      this._actions[this._actions.length - 1];
  }

  get isComplete(): boolean {
    return this.currentAction === this._actions[this._actions.length - 1];
  }

  get actions(): string[] {
    return [...this._actions];
  }

  toJSON() {
    return {
      currentAction: this.currentAction,
      actions: this._actions,
    };
  }

  static fromJSON(data: { currentAction: string; actions: string[] }) {
    return new ActionController(data.actions, data.currentAction);
  }

  static unexpectedActionMessage(unexpected: string, expected: string): string {
    return `Ação inválida: ${unexpected}. Ação esperada: ${expected}.`;
  }
}
