import CRISES from '../../data/crises';
import { LawType } from '../role';
import { Round } from '../round';
import { Crisis, CrisisParams } from './crisis';
import { CRISIS_NAMES } from './crisis-names';

export class FmiMandou extends Crisis {
  constructor(params: Partial<CrisisParams> = {}) {
    super({
      name: CRISIS_NAMES.O_FMI_MANDOU,
      description: CRISES.O_FMI_MANDOU.description,
      titles: CRISES.O_FMI_MANDOU.titles,
      visibleTo: CRISES.O_FMI_MANDOU.visibleTo,
      notVisibleTo: CRISES.O_FMI_MANDOU.notVisibleTo,
      ...params,
    });
  }

  effect(round: Round): void {
    round.requiredVeto = LawType.PROGRESSISTAS;
  }
}
