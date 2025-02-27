import { CRISIS_NAMES } from 'src/domain/crisis/crisis-names';
import { describe, expect, it } from 'vitest';
import { CrisisFactory } from '../crisis/crisis-factory';
import { Mensalao } from '../crisis/mensalao';
import { makeRound } from '../mock';
import { CrisisStage } from './crisis-stage';
import { LawType } from 'src/domain/role';

describe('Estágio de Crise', () => {
  it('deve aplicar efeito automático da crise Forças Ocultas', () => {
    const crisis = CrisisFactory.create(CRISIS_NAMES.FORCAS_OCULTAS);
    const stage = new CrisisStage(crisis);
    const round = makeRound();

    const [error] = stage.startCrisis(round);
    expect(error).toBeUndefined();
    expect(round.requiredVeto).toBe(LawType.PROGRESSISTAS);
    expect(stage.isComplete).toBe(true);
  });

  it('deve permitir escolher jogadores na crise Mensalão', () => {
    const crisis = CrisisFactory.create(CRISIS_NAMES.MENSALAO);
    const stage = new CrisisStage(crisis);
    const mensalao = stage.crisisEffect as Mensalao;
    mensalao.setMirrorId('Jogador 4');
    const [chooseError] = mensalao.choosePlayer('Jogador 1');
    expect(chooseError).toBeUndefined();
    const [chooseError2] = mensalao.choosePlayer('Jogador 2');
    expect(chooseError2).toBeUndefined();
    const [chooseError3] = mensalao.choosePlayer('Jogador 3');
    expect(chooseError3).toBeUndefined();
    expect(mensalao.chosenPlayers.has('Jogador 1')).toBe(true);
    expect(mensalao.chosenPlayers.has('Jogador 2')).toBe(true);
    expect(mensalao.chosenPlayers.has('Jogador 3')).toBe(true);
    expect(stage.isComplete).toBe(false);
    const round = makeRound();
    const [error] = stage.startCrisis(round);
    expect(error).toBeUndefined();
  });

  it('deve aplicar efeito da crise Mensalão após escolher jogador', () => {
    const crisis = CrisisFactory.create(CRISIS_NAMES.MENSALAO);
    const stage = new CrisisStage(crisis);
    const round = makeRound();
    stage.startCrisis(round);
    const mensalao = stage.crisisEffect as Mensalao;
    mensalao.setMirrorId('Jogador 4');
    mensalao.choosePlayer('Jogador 1');
    const [applyError] = mensalao.apply(round);
    expect(applyError).toBeUndefined();
    expect(round.mirroedVotes.get('Jogador 1')).toBe('Jogador 4');
  });

  it('não deve permitir aplicar efeito da crise Mensalão sem escolher jogador', () => {
    const crisis = CrisisFactory.create(CRISIS_NAMES.MENSALAO);
    const stage = new CrisisStage(crisis);
    const round = makeRound();

    stage.startCrisis(round);
    const mensalao = stage.crisisEffect as Mensalao;
    const [applyError] = mensalao.apply(round);
    expect(applyError).toBe('Nenhum jogador foi escolhido.');
  });
});
