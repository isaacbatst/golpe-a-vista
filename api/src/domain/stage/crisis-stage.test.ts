import { CRISIS_NAMES } from 'src/domain/crisis/crisis-names';
import { LawType } from 'src/domain/role';
import { describe, expect, it } from 'vitest';
import { CrisisFactory } from '../crisis/crisis-factory';
import { makeRound } from '../mock';
import { CrisisStage } from './crisis-stage';

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
});
