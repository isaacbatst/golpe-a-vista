import { ActionController } from 'src/domain/action-controller';
import { describe, expect, it } from 'vitest';
import { Mensalao, MensalaoAction } from './mensalao';
import { makeRound } from 'src/domain/mock';

describe('Mensalão', () => {
  it('deve escolher um jogador para ser comprado', () => {
    const mensalao = new Mensalao();
    mensalao.choosePlayer('Jogador 1');
    expect(mensalao.chosenPlayer).toBe('Jogador 1');
    expect(mensalao.currentAction).toBe(MensalaoAction.ADVANCE_STAGE);
  });

  it('deve salvar o voto forçado no round', () => {
    const round = makeRound();
    const mensalao = new Mensalao();
    mensalao.choosePlayer('p1');
    mensalao.apply(round);
    expect(round.legislativeForcedVotes.size).toBe(1);
  });

  it('não deve permitir escolher jogador duas vezes', () => {
    const mensalao = new Mensalao(MensalaoAction.ADVANCE_STAGE);
    const [error] = mensalao.choosePlayer('Jogador 1');
    expect(error).toBe(
      ActionController.unexpectedActionMessage(
        MensalaoAction.CHOOSE_PLAYER,
        MensalaoAction.ADVANCE_STAGE,
      ),
    );
  });
});
