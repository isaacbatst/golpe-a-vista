import { describe, expect, it } from 'vitest';
import { ActionController } from '../action-controller';
import { makeCrisesDeck } from '../mock';
import { SabotageAction, SabotageStage } from './sabotage-stage';

describe('Estágio de Sabotagem', () => {
  it('deve sacar crises e escolher uma', () => {
    const stage = new SabotageStage();
    const [drawCrisesError] = stage.drawCrises(makeCrisesDeck());
    expect(drawCrisesError).toBeUndefined();
    expect(stage.drawnCrises).toBeDefined();
    const [chooseCrisisError] = stage.chooseSabotageCrisis(0);
    expect(chooseCrisisError).toBeUndefined();
  });

  it('não deve escolher uma crise sem sacar', () => {
    const stage = new SabotageStage();
    const [chooseCrisisError] = stage.chooseSabotageCrisis(0);
    expect(chooseCrisisError).toBe(
      ActionController.unexpectedActionMessage(
        SabotageAction.CHOOSE_CRISIS,
        SabotageAction.DRAW_CRISIS,
      ),
    );
  });
});
