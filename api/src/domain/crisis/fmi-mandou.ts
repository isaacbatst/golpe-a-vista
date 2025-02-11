import CRISES from '../../data/crises';
import { LawType } from '../role';
import { Round } from '../round';
import { Crisis } from './crisis';

export class FmiMandou extends Crisis {
  constructor() {
    super({
      description: CRISES.O_FMI_MANDOU.description,
      titles: CRISES.O_FMI_MANDOU.titles,
      visibleTo: CRISES.O_FMI_MANDOU.visibleTo,
      notVisibleTo: CRISES.O_FMI_MANDOU.notVisibleTo,
    });
  }

  effect(round: Round): void {
    round.requiredVeto = LawType.PROGRESSISTAS;
  }
}
