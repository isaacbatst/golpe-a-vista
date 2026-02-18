import { describe, expect, it } from 'vitest';
import { ActionController } from '../action-controller';
import { makeSabotageCardsDeck } from '../mock';
import { InterceptionAction, InterceptionStage } from './interception-stage';

describe('Estágio de Interceptação', () => {
  it('deve poder pular interceptação', () => {
    const stage = new InterceptionStage();
    const [error] = stage.interceptOrSkip(false);
    expect(error).toBeUndefined();
    expect(stage.currentAction).toBe(InterceptionAction.ADVANCE_STAGE);
  });

  it('deve sacar crises e escolher uma', () => {
    const stage = new InterceptionStage();
    const [interceptOrSkipError] = stage.interceptOrSkip(true);
    expect(interceptOrSkipError).toBeUndefined();
    const [drawSabotageCardsError] = stage.drawSabotageCards(makeSabotageCardsDeck());
    expect(drawSabotageCardsError).toBeUndefined();
    expect(stage.drawnSabotageCards).toBeDefined();
    const [chooseSabotageCardError] = stage.chooseSabotageCard(0);
    expect(chooseSabotageCardError).toBeUndefined();
  });

  it('não deve escolher uma crise sem sacar', () => {
    const stage = new InterceptionStage();
    const [interceptOrSkipError] = stage.interceptOrSkip(true);
    expect(interceptOrSkipError).toBeUndefined();
    const [chooseSabotageCardError] = stage.chooseSabotageCard(0);
    expect(chooseSabotageCardError).toBe(
      ActionController.unexpectedActionMessage(
        InterceptionAction.CHOOSE_SABOTAGE_CARD,
        InterceptionAction.DRAW_SABOTAGE_CARDS,
      ),
    );
  });
});
