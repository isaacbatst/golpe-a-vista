import { Law } from 'src/data/laws';
import { PlanoCohen } from 'src/domain/crisis/plano-cohen';
import { LawType } from 'src/domain/role';
import { StageType } from 'src/domain/stage/stage';
import { StageQueue } from 'src/domain/stage/stage-queue';
import { describe, expect, it } from 'vitest';

describe('Stage Queue', () => {
  it('deve iniciar por padrão com o estágio Legislativo', () => {
    const queue = new StageQueue();
    const stage = queue.nextStage({
      presidentId: 'p1',
    });
    expect(stage?.type).toBe(StageType.LEGISLATIVE);
  });

  it('deve avançar do estágio Legislativo para o estágio de Dossiê', () => {
    const queue = new StageQueue();
    queue.nextStage({
      presidentId: 'p1',
    });
    const stage = queue.nextStage({
      presidentId: 'p1',
      drawnLaws: [new Law('l1', LawType.CONSERVADORES, 'Conservadores')],
    });
    expect(stage?.type).toBe(StageType.REPORT_DOSSIER);
  });

  it('deve retornar null quando não houver mais estágios a serem criados', () => {
    const queue = new StageQueue();
    queue.nextStage({
      presidentId: 'p1',
    });
    queue.nextStage({
      presidentId: 'p1',
      drawnLaws: [new Law('l1', LawType.CONSERVADORES, 'Conservadores')],
    });
    const stage = queue.nextStage({
      presidentId: 'p1',
    });
    expect(stage).toBeNull();
  });

  it('deve iniciar com estágio de impeachment se marcado', () => {
    const queue = new StageQueue();
    const stage = queue.nextStage({
      presidentId: 'p1',
      hasImpeachment: true,
    });
    expect(stage?.type).toBe(StageType.IMPEACHMENT);
  });

  it('deve avançar do impeachment para o legislativo', () => {
    const queue = new StageQueue();
    queue.nextStage({
      presidentId: 'p1',
      hasImpeachment: true,
    });
    const stage = queue.nextStage({
      presidentId: 'p1',
      hasImpeachment: true,
    });
    expect(stage?.type).toBe(StageType.LEGISLATIVE);
  });

  it('deve iniciar com estágio de crise se houver crise e não houver impeachment', () => {
    const queue = new StageQueue();
    const stage = queue.nextStage({
      presidentId: 'p1',
      crisis: new PlanoCohen(),
    });
    expect(stage?.type).toBe(StageType.CRISIS);
  });

  it('deve avançar do impeachment para crise se houver ambas', () => {
    const queue = new StageQueue();
    queue.nextStage({
      presidentId: 'p1',
      hasImpeachment: true,
      crisis: new PlanoCohen(),
    });
    const stage = queue.nextStage({
      presidentId: 'p1',
      hasImpeachment: true,
      crisis: new PlanoCohen(),
    });
    expect(stage?.type).toBe(StageType.CRISIS);
  });

  it('deve avançar do dossiê para sabotagem se puder sabotar', () => {
    const queue = new StageQueue();
    queue.nextStage({
      presidentId: 'p1',
    });
    queue.nextStage({
      presidentId: 'p1',
      drawnLaws: [new Law('l1', LawType.CONSERVADORES, 'Conservadores')],
      hasLastRoundBeenSabotaged: false,
      hasApprovedProgressiveLaw: true,
    });
    const stage = queue.nextStage({
      presidentId: 'p1',
      hasLastRoundBeenSabotaged: false,
      hasApprovedProgressiveLaw: true,
      drawnLaws: [new Law('l1', LawType.CONSERVADORES, 'Conservadores')],
    });
    expect(stage?.type).toBe(StageType.SABOTAGE);
  });
});
