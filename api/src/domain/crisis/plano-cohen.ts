import CRISES from '../../data/crises';
import { Round } from '../round';
import { Crisis, CrisisParams } from './crisis';
import { CRISIS_NAMES } from './crisis-names';

export class PlanoCohen extends Crisis {
  constructor(params: Partial<CrisisParams> = {}) {
    super({
      name: CRISIS_NAMES.PLANO_COHEN,
      description: CRISES.PLANO_COHEN.description,
      titles: CRISES.PLANO_COHEN.titles,
      visibleTo: CRISES.PLANO_COHEN.visibleTo,
      notVisibleTo: CRISES.PLANO_COHEN.notVisibleTo,
      ...params,
    });
  }

  effect(round: Round): void {
    round.isDossierFake = true;
  }
}
