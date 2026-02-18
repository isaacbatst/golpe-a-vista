import { ActionController } from '../action-controller';
import { Either } from '../either';

export enum StageType {
  LEGISLATIVE = 'LEGISLATIVE',
  IMPEACHMENT = 'IMPEACHMENT',
  SABOTAGE_CARD = 'SABOTAGE_CARD',
  CPI = 'CPI',
  INTERCEPTION = 'INTERCEPTION',
  RADICALIZATION = 'RADICALIZATION',
}

export abstract class Stage {
  abstract readonly type: StageType;
  protected actionController: ActionController;

  constructor(actions: string[], currentAction?: string) {
    this.actionController = new ActionController(actions, currentAction);
  }

  get currentAction(): string {
    return this.actionController.currentAction;
  }

  protected assertCurrentAction(action: string): Either<string, void> {
    return this.actionController.assertCurrentAction(action);
  }

  protected advanceAction(to?: string): void {
    this.actionController.advanceAction(to);
  }

  get isComplete(): boolean {
    return this.actionController.isComplete;
  }

  toJSON() {
    return {
      isComplete: this.isComplete,
    };
  }
}
