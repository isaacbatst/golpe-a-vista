import CRISES from '../../data/crises';
import { Round } from '../round';
import { Crisis } from './crisis';

export class CafeComAbin extends Crisis {
  constructor() {
    super({
      description: CRISES.CAFE_COM_A_ABIN.description,
      titles: CRISES.CAFE_COM_A_ABIN.titles,
      visibleTo: CRISES.CAFE_COM_A_ABIN.visibleTo,
      notVisibleTo: CRISES.CAFE_COM_A_ABIN.notVisibleTo,
    });
  }

  effect(round: Round): void {
    round.isDossierOmitted = true;
  }
}
