import { describe, expect, it } from 'vitest';
import { makeRound } from '../mock';
import { PlanoCohen } from './plano-cohen';

describe('Plano Cohen', () => {
  it('não deve permitir que o relator veja o dossiê', () => {
    const planoCohen = new PlanoCohen();
    const round = makeRound();

    planoCohen.effect(round);

    expect(round.isDossierFake).toBe(true);
  });
});
