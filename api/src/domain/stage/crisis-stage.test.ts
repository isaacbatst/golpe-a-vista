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

  it('deve permitir escolher jogador na crise Mensalão', () => {
    const crisis = CrisisFactory.create(CRISIS_NAMES.MENSALAO);
    const stage = new CrisisStage(crisis);
    const round = makeRound();
    const [error] = stage.startCrisis(round);
    expect(error).toBeUndefined();

    const mensalao = stage.crisisEffect as Mensalao;
    const [chooseError] = mensalao.choosePlayer('Jogador 1');
    expect(chooseError).toBeUndefined();
    expect(mensalao.chosenPlayer).toBe('Jogador 1');
    expect(stage.isComplete).toBe(false);
  });

  it('deve aplicar efeito da crise Mensalão após escolher jogador', () => {
    const crisis = CrisisFactory.create(CRISIS_NAMES.MENSALAO);
    const stage = new CrisisStage(crisis);
    const round = makeRound();

    stage.startCrisis(round);
    const mensalao = stage.crisisEffect as Mensalao;
    mensalao.choosePlayer('Jogador 1');
    const [applyError] = mensalao.apply(round);
    expect(applyError).toBeUndefined();
    expect(round.legislativeForcedVotes.get('Jogador 1')).toBe(true);
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
