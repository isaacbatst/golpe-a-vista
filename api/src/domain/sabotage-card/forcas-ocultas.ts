import { Either, right } from 'src/domain/either';
import { LawType } from '../role';
import { Round } from '../round';
import { SabotageCardEffect } from './sabotage-card-effect';
import { SABOTAGE_CARD_NAMES } from './sabotage-card-names';

export enum ForcasOcultasAction {
  ADVANCE_STAGE = 'ADVANCE_STAGE',
}

export class ForcasOcultas extends SabotageCardEffect {
  readonly sabotageCardName = SABOTAGE_CARD_NAMES.FORCAS_OCULTAS;
  constructor(currentAction?: ForcasOcultasAction) {
    super([ForcasOcultasAction.ADVANCE_STAGE], currentAction);
  }

  apply(round: Round): Either<string, void> {
    round.requiredVeto = LawType.PROGRESSISTAS;
    return right();
  }
  toJSON() {
    return {
      ...super.toJSON(),
      sabotageCard: this.sabotageCardName,
    } as const;
  }

  static fromJSON(data: ReturnType<ForcasOcultas['toJSON']>) {
    return new ForcasOcultas(data.currentAction as ForcasOcultasAction);
  }
}
