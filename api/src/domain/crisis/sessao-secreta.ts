import CRISES from '../../data/crises';
import { Round } from '../round';
import { Crisis } from './crisis';

export class SessaoSecreta extends Crisis {
  constructor() {
    super({
      description: CRISES.SESSAO_SECRETA.description,
      titles: CRISES.SESSAO_SECRETA.titles,
      visibleTo: CRISES.SESSAO_SECRETA.visibleTo,
      notVisibleTo: CRISES.SESSAO_SECRETA.notVisibleTo,
    });
  }

  effect(round: Round): void {
    round.isLegislativeVotingSecret = true;
  }
}
