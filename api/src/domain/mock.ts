import CRISES from '../data/crises';
import { Law } from '../data/laws';
import { PlanoCohen } from './crisis/plano-cohen';
import { Deck } from './deck';
import { Player } from './player';
import { PresidentQueue } from './president-queue';
import { LawType, Role } from './role';
import { Round, RoundParams } from './round';

export const makeCrisesDeck = () => {
  const [error, deck] = Deck.create(
    Object.values(CRISES).map(() => new PlanoCohen()),
  );
  if (!deck) {
    throw new Error(error);
  }
  return deck;
};

export const makeLawsDeck = (
  laws: Law[] | 'progressive' | 'conservative' = [
    { description: 'Lei 1', type: LawType.CONSERVADORES, name: 'L1' },
    { description: 'Lei 2', type: LawType.CONSERVADORES, name: 'L2' },
    { description: 'Lei 3', type: LawType.CONSERVADORES, name: 'L3' },
    { description: 'Lei 4', type: LawType.CONSERVADORES, name: 'L4' },
  ],
) => {
  if (laws === 'progressive') {
    laws = Array.from({ length: 5 }, (_, i) => ({
      description: `Lei ${i + 1}`,
      type: LawType.PROGRESSISTAS,
      name: `L${i + 1}`,
    }));
  }
  if (laws === 'conservative') {
    laws = Array.from({ length: 5 }, (_, i) => ({
      description: `Lei ${i + 1}`,
      type: LawType.CONSERVADORES,
      name: `L${i + 1}`,
    }));
  }

  const [error, deck] = Deck.create(laws);
  if (!deck) {
    throw new Error(error);
  }
  return deck;
};

export const makeRound = (params: Partial<RoundParams> = {}) => {
  return new Round({
    ...params,
    presidentQueue:
      params.presidentQueue ??
      new PresidentQueue([
        new Player('p1', Role.CONSERVADOR),
        new Player('p2', Role.CONSERVADOR),
      ]),
    lawsDeck: params.lawsDeck ?? makeLawsDeck(),
    crisesDeck: params.crisesDeck ?? makeCrisesDeck(),
  });
};
