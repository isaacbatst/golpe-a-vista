import { Either, left, right } from "../either";

export enum StageType {
  LEGISLATIVE = "LEGISLATIVE",
  IMPEACHMENT = "IMPEACHMENT",
  CRISIS = "CRISIS",
  REPORT_DOSSIER = "REPORT_DOSSIER",
  SABOTAGE = "SABOTAGE",
  RADICALIZATION = "RADICALIZATION",
}

export abstract class Stage {
  static unexpectedActionMessage(unexpected: string, expected: string): string {
    return `Ação inválida: ${unexpected}. Ação esperada: ${expected}.`;
  }

  abstract readonly type: StageType;
  protected _currentAction: string;
  private _actions: string[];

  constructor(actions: string[]) {
    this._actions = actions;
    this._currentAction = actions[0];
  }

  get currentAction(): string {
    return this._currentAction;
  }

  protected assertCurrentAction(action: string): Either<string, void> {
    if (this._currentAction !== action) {
      return left(Stage.unexpectedActionMessage(action, this._currentAction));
    }
    return right();
  }

  protected advanceAction(): void {
    const currentIndex = this._actions.indexOf(this._currentAction);
    this._currentAction = this._actions[currentIndex + 1] ?? this._actions[this._actions.length - 1];
  }

  isComplete(): boolean {
    return this._currentAction === this._actions[this._actions.length - 1];
  }
}
