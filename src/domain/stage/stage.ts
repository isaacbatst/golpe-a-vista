import { ActionController } from "../action-controller";
import { Either } from "../either";

export enum StageType {
  LEGISLATIVE = "LEGISLATIVE",
  IMPEACHMENT = "IMPEACHMENT",
  CRISIS = "CRISIS",
  REPORT_DOSSIER = "REPORT_DOSSIER",
  SABOTAGE = "SABOTAGE",
  RADICALIZATION = "RADICALIZATION",
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

  protected advanceAction(): void {
    this.actionController.advanceAction();
  }

  get isComplete(): boolean {
    return this.actionController.isComplete;
  }
}