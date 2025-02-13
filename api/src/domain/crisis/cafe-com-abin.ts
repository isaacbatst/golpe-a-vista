import CRISES from '../../data/crises';
import { Round } from '../round';
import { Crisis, CrisisParams } from './crisis';
import { CRISIS_NAMES } from './crisis-names';

export class CafeComAbin extends Crisis {
  constructor(params: Partial<CrisisParams> = {}) {
    super({
      name: CRISIS_NAMES.CAFE_COM_A_ABIN,
      description: CRISES.CAFE_COM_A_ABIN.description,
      titles: CRISES.CAFE_COM_A_ABIN.titles,
      visibleTo: CRISES.CAFE_COM_A_ABIN.visibleTo,
      notVisibleTo: CRISES.CAFE_COM_A_ABIN.notVisibleTo,
      ...params,
    });
  }

  effect(round: Round): void {
    round.isDossierOmitted = true;
  }
}
