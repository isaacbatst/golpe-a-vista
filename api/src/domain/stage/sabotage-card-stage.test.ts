import { SABOTAGE_CARD_NAMES } from 'src/domain/sabotage-card/sabotage-card-names';
import { LawType } from 'src/domain/role';
import { describe, expect, it } from 'vitest';
import { SabotageCardFactory } from '../sabotage-card/sabotage-card-factory';
import { makeRound } from '../mock';
import { SabotageCardStage } from './sabotage-card-stage';

describe('Estágio de Sabotagem', () => {
  it('deve aplicar efeito automático da sabotagem Forças Ocultas', () => {
    const sabotageCard = SabotageCardFactory.create(SABOTAGE_CARD_NAMES.FORCAS_OCULTAS);
    const stage = new SabotageCardStage(sabotageCard);
    const round = makeRound();

    const [error] = stage.applySabotageCard(round);
    expect(error).toBeUndefined();
    expect(round.requiredVeto).toBe(LawType.PROGRESSISTAS);
    expect(stage.isComplete).toBe(true);
  });
});
