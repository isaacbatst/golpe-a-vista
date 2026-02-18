import { makeRound } from 'src/domain/mock';
import { describe, expect, it } from 'vitest';
import { Mensalao, MensalaoAction } from './mensalao';
import { ActionController } from 'src/domain/action-controller';

describe('Mensalão', () => {
  it('deve escolher até três jogadores para serem comprados', () => {
    const mensalao = new Mensalao();
    mensalao.setMirrorId('p4');
    const [choosePlayerError] = mensalao.choosePlayers(['p1', 'p2', 'p3']);
    expect(choosePlayerError).toBeUndefined();
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
    mensalao.choosePlayers(['p2']);
    mensalao.apply(round);
    expect(round.mirroedVotes.size).toBe(1);
    expect(round.mirroedVotes.get('p2')).toBe('p4');
  });

  it('deve permitir pular escolha de jogadores', () => {
    const mensalao = new Mensalao();
    mensalao.setMirrorId('p4');
    mensalao.apply(makeRound());
    expect(mensalao.chosenPlayers.size).toBe(0);
  });

  it('deve permitir não enviar jogador espelhado se não houverem jogadores escolhidos', () => {
    const mensalao = new Mensalao();
    const [error] = mensalao.apply(makeRound());
    expect(error).toBeUndefined();
  });

  it('não deve permitir escolher jogadores antes de definir o espelhado', () => {
    const mensalao = new Mensalao();
    const [error] = mensalao.choosePlayers(['p1']);
    expect(error).toBe(
      ActionController.unexpectedActionMessage(
        MensalaoAction.CHOOSE_PLAYER,
        MensalaoAction.SET_MIRROR_ID,
      ),
    );
  });
});
