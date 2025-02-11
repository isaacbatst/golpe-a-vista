import { describe, expect, it } from 'vitest';
import { makeRound } from '../mock';
import { CafeComAbin } from './cafe-com-abin';

describe('Café com a Abin', () => {
  it('não deve permitir que o relator veja o dossiê', () => {
    const cafeComAAbin = new CafeComAbin();
    const round = makeRound();

    cafeComAAbin.effect(round);

    expect(round.isDossierOmitted).toBe(true);
  });
});
