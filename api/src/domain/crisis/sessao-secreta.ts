import CRISES from '../../data/crises';
import { Round } from '../round';
import { Crisis, CrisisParams } from './crisis';
import { CRISIS_NAMES } from './crisis-names';

export class SessaoSecreta extends Crisis {
  constructor(params: Partial<CrisisParams> = {}) {
    super({
      name: CRISIS_NAMES.SESSAO_SECRETA,
      description: CRISES.SESSAO_SECRETA.description,
      titles: CRISES.SESSAO_SECRETA.titles,
      visibleTo: CRISES.SESSAO_SECRETA.visibleTo,
      notVisibleTo: CRISES.SESSAO_SECRETA.notVisibleTo,
      ...params,
    });
  }

  effect(round: Round): void {
    round.isLegislativeVotingSecret = true;
  }
}
