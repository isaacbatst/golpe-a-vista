import { describe, expect, it } from 'vitest';
import { makeRound } from '../mock';
import { GolpeDeEstado } from './golpe-de-estado';

describe('Golpe de Estado', () => {
  it('deve pular o presidente', () => {
    const golpeDeEstado = new GolpeDeEstado();
    const round = makeRound();
    golpeDeEstado.apply(round);
    expect(round.president.name).toBe('p2');
  });
});
