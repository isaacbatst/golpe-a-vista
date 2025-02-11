import CRISES from '../../data/crises';
import { LawType } from '../role';
import { Round } from '../round';
import { Crisis } from './crisis';

export class ForcasOcultas extends Crisis {
  constructor() {
    super({
      description: CRISES.FORCAS_OCULTAS.description,
      titles: CRISES.FORCAS_OCULTAS.titles,
      visibleTo: CRISES.FORCAS_OCULTAS.visibleTo,
      notVisibleTo: CRISES.FORCAS_OCULTAS.notVisibleTo,
    });
  }

  effect(round: Round): void {
    round.requiredVeto = LawType.PROGRESSISTAS;
  }
}
