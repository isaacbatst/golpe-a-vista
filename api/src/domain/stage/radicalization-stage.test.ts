import { describe, expect, it } from 'vitest';
import { ActionController } from '../action-controller';
import { Player } from '../player';
import { Role } from '../role';
import {
  RadicalizationAction,
  RadicalizationStage,
} from './radicalization-stage';

describe('Estágio de Radicalização', () => {
  it('deve radicalizar um alvo', () => {
    const stage = new RadicalizationStage();
    const target = new Player('p1', Role.MODERADO);
    stage.radicalize(target);
    expect(target.radicalized).toBe(true);
  });

  it('não deve radicalizar dois jogadores', () => {
    const stage = new RadicalizationStage();
    const target = new Player('p1', Role.MODERADO);
    stage.radicalize(target);
    const [error] = stage.radicalize(target);
    expect(error).toBe(
      ActionController.unexpectedActionMessage(
        RadicalizationAction.RADICALIZE,
        RadicalizationAction.ADVANCE_STAGE,
      ),
    );
  });
});
