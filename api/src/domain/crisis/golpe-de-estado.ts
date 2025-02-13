import CRISES from '../../data/crises';
import { Round } from '../round';
import { Crisis, CrisisParams } from './crisis';
import { CRISIS_NAMES } from './crisis-names';

export class GolpeDeEstado extends Crisis {
  constructor(params: Partial<CrisisParams> = {}) {
    super({
      name: CRISIS_NAMES.GOLPE_DE_ESTADO,
      description: CRISES.GOLPE_DE_ESTADO.description,
      titles: CRISES.GOLPE_DE_ESTADO.titles,
      notVisibleTo: CRISES.GOLPE_DE_ESTADO.notVisibleTo,
      visibleTo: CRISES.GOLPE_DE_ESTADO.visibleTo,
      ...params,
    });
  }

  effect(round: Round): void {
    round.presidentQueue.shift();
  }
}
