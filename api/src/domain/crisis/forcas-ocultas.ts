import CRISES from '../../data/crises';
import { LawType } from '../role';
import { Round } from '../round';
import { Crisis, CrisisParams } from './crisis';
import { CRISIS_NAMES } from './crisis-names';

export class ForcasOcultas extends Crisis {
  constructor(params: Partial<CrisisParams> = {}) {
    super({
      name: CRISIS_NAMES.FORCAS_OCULTAS,
      description: CRISES.FORCAS_OCULTAS.description,
      titles: CRISES.FORCAS_OCULTAS.titles,
      visibleTo: CRISES.FORCAS_OCULTAS.visibleTo,
      notVisibleTo: CRISES.FORCAS_OCULTAS.notVisibleTo,
      ...params,
    });
  }

  effect(round: Round): void {
    round.requiredVeto = LawType.PROGRESSISTAS;
  }
}
