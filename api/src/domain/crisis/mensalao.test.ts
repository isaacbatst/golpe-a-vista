import { makeRound } from 'src/domain/mock';
import { describe, expect, it } from 'vitest';
import { Mensalao, MensalaoAction } from './mensalao';

describe('Mensalão', () => {
  it('deve escolher até três jogadores para serem comprados', () => {
    const mensalao = new Mensalao();
    mensalao.setMirrorId('p4');
    const [choosePlayerError] = mensalao.choosePlayer('p1');
    expect(choosePlayerError).toBeUndefined();
    expect(mensalao.currentAction).toBe(MensalaoAction.CHOOSE_PLAYER);
    const [choosePlayerError2] = mensalao.choosePlayer('p2');
    expect(choosePlayerError2).toBeUndefined();
    expect(mensalao.currentAction).toBe(MensalaoAction.CHOOSE_PLAYER);
    const [choosePlayerError3] = mensalao.choosePlayer('p3');
    expect(choosePlayerError3).toBeUndefined();
    expect(mensalao.chosenPlayers.size).toBe(3);
    expect(mensalao.chosenPlayers.has('p1')).toBe(true);
    expect(mensalao.chosenPlayers.has('p2')).toBe(true);
    expect(mensalao.chosenPlayers.has('p3')).toBe(true);
    expect(mensalao.currentAction).toBe(MensalaoAction.ADVANCE_STAGE);
  });

  it('deve salvar o voto espelhado no round', () => {
    const round = makeRound();
    const mensalao = new Mensalao();
    mensalao.setMirrorId('p4');
    mensalao.choosePlayer('p2');
    mensalao.apply(round);
    expect(round.mirroedVotes.size).toBe(1);
    expect(round.mirroedVotes.get('p2')).toBe('p4');
  });
});
