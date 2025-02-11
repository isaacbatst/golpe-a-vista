import CRISES from '../../data/crises';
import { Round } from '../round';
import { Crisis } from './crisis';

export class GolpeDeEstado extends Crisis {
  constructor() {
    super({
      description: CRISES.GOLPE_DE_ESTADO.description,
      titles: CRISES.GOLPE_DE_ESTADO.titles,
      notVisibleTo: CRISES.GOLPE_DE_ESTADO.notVisibleTo,
      visibleTo: CRISES.GOLPE_DE_ESTADO.visibleTo,
    });
  }

  effect(round: Round): void {
    round.presidentQueue.shift();
  }
}
