import { SABOTAGE_CARD_NAMES } from 'src/domain/sabotage-card/sabotage-card-names';
import { Round } from '../round';
import { SabotageCardEffect } from './sabotage-card-effect';
import { Either, right } from 'src/domain/either';
import { LawType } from 'src/domain/role';

export enum VetoStfAction {
  ADVANCE_STAGE = 'ADVANCE_STAGE',
}

export class VetoStf extends SabotageCardEffect {
  readonly sabotageCardName = SABOTAGE_CARD_NAMES.VETO_DO_STF;
  constructor(currentAction?: VetoStfAction) {
    super([VetoStfAction.ADVANCE_STAGE], currentAction);
  }

  apply(round: Round): Either<string, void> {
    round.disablePreviousLaw = LawType.PROGRESSISTAS;
    return right();
  }
  toJSON() {
    return {
      ...super.toJSON(),
      sabotageCard: this.sabotageCardName,
    } as const;
  }

  static fromJSON(data: ReturnType<VetoStf['toJSON']>) {
    return new VetoStf(data.currentAction as VetoStfAction);
  }
}
