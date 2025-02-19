import { Crisis } from 'src/domain/crisis/crisis';
import CRISES from '../data/crises';
import { Law } from '../data/laws';
import { Deck } from './deck';
import { Player } from './player';
import { PresidentQueue } from './president-queue';
import { LawType, Role } from './role';
import { Round, RoundParams } from './round';

export const makeCrisesDeck = () => {
  const [error, deck] = Deck.create(
    Object.values(CRISES).map(() => new Crisis(CRISES.CAFE_COM_A_ABIN)),
  );
  if (!deck) {
    throw new Error(error);
  }
  return deck;
};

export const makeLawsDeck = (
  laws: Law[] | 'progressive' | 'conservative' = [
    new Law('Lei 1', LawType.CONSERVADORES, 'L1'),
    new Law('Lei 2', LawType.CONSERVADORES, 'L2'),
    new Law('Lei 3', LawType.CONSERVADORES, 'L3'),
    new Law('Lei 4', LawType.CONSERVADORES, 'L4'),
  ],
) => {
  if (laws === 'progressive') {
    laws = Array.from(
      { length: 5 },
      (_, i) => new Law(`Lei ${i + 1}`, LawType.PROGRESSISTAS, `L${i + 1}`),
    );
  }
  if (laws === 'conservative') {
    laws = Array.from(
      { length: 5 },
      (_, i) => new Law(`Lei ${i + 1}`, LawType.CONSERVADORES, `L${i + 1}`),
    );
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
        new Player('p1', 'p1', Role.CONSERVADOR),
        new Player('p2', 'p2', Role.CONSERVADOR),
      ]),
  });
};
