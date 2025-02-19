import { CRISIS_NAMES } from 'src/domain/crisis/crisis-names';
import { ActionController } from '../action-controller';
import { Round } from '../round';

export abstract class CrisisEffect {
  protected _actionController: ActionController | null;
  abstract readonly crisis: CRISIS_NAMES;

  constructor(actions?: string[], currentAction?: string) {
    this._actionController = actions
      ? new ActionController(actions, currentAction)
      : null;
  }

  abstract apply(round: Round): void;

  get currentAction(): string | null {
    return this._actionController?.currentAction ?? null;
  }

  get hasPendingActions(): boolean {
    return !this._actionController?.isComplete;
  }

  get isComplete(): boolean {
    return this._actionController?.isComplete ?? true;
  }

  get actions(): string[] | null {
    return this._actionController?.actions ?? null;
  }

  toJSON() {
    return {
      currentAction: this.currentAction,
      isComplete: this.isComplete,
      actions: this.actions,
    };
  }
}
