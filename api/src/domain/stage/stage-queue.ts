import { StageFactory } from 'src/domain/stage/stage.factory';
import { Stage } from './stage';

export enum RoundStageIndex {
  IMPEACHMENT = 0,
  CRISIS = 1,
  LEGISLATIVE = 2,
  DOSSIER = 3,
  SABOTAGE = 4,
  RADICALIZATION = 5,
}

export class StageQueue {
  constructor(private _nextStage: number = 0) {}

  isFinished(factories: StageFactory[]): boolean {
    for (let i = this._nextStage; i < factories.length; i++) {
      if (!factories[i].shouldSkip()) {
        return false;
      }
    }

    return true;
  }

  nextStage(factories: StageFactory[]): Stage | null {
    for (let i = this._nextStage; i < factories.length; i++) {
      if (factories[i].shouldSkip()) {
        continue;
      }

      const stage = factories[i].create();
      this._nextStage = i + 1;
      return stage;
    }

    return null;
  }

  get nextStageIndex() {
    return this._nextStage;
  }

  toJSON() {
    return {
      nextStageIndex: this._nextStage,
    };
  }

  static fromJSON(data: ReturnType<StageQueue['toJSON']>) {
    return new StageQueue(data.nextStageIndex);
  }
}
