import { describe, expect, it } from 'vitest';
import { makeRound } from '../mock';
import { SessaoSecreta } from './sessao-secreta';

describe('Sessão Secreta', () => {
  it('deve tornar a sessão legislativa secreta', () => {
    const sessaoSecreta = new SessaoSecreta();
    const round = makeRound();
    sessaoSecreta.effect(round);
    expect(round.isLegislativeVotingSecret).toBe(true);
  });
});
