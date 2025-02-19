import { LawType } from '../role';
import { Round } from '../round';
import { CrisisEffect } from './crisis-effect';
import { CRISIS_NAMES } from './crisis-names';

export enum ForcasOcultasAction {
  ADVANCE_STAGE = 'ADVANCE_STAGE',
}

export class ForcasOcultas extends CrisisEffect {
  readonly crisis = CRISIS_NAMES.FORCAS_OCULTAS;
  constructor(currentAction?: ForcasOcultasAction) {
    super([ForcasOcultasAction.ADVANCE_STAGE], currentAction);
  }

  apply(round: Round): void {
    round.requiredVeto = LawType.PROGRESSISTAS;
  }
  toJSON() {
    return {
      ...super.toJSON(),
      crisis: this.crisis,
    } as const;
  }

  static fromJSON(data: ReturnType<ForcasOcultas['toJSON']>) {
    return new ForcasOcultas(data.currentAction as ForcasOcultasAction);
  }
}
