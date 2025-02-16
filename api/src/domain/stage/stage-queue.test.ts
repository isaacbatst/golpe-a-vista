import { Law } from 'src/data/laws';
import { LawType } from 'src/domain/role';
import { DossierStageFactory } from 'src/domain/stage/dossier-stage.factory';
import { ImpeachmentStageFactory } from 'src/domain/stage/impeachment-stage.factory';
import { LegislativeStageFactory } from 'src/domain/stage/legislative-stage.factory';
import { StageType } from 'src/domain/stage/stage';
import { StageQueue } from 'src/domain/stage/stage-queue';
import { describe, expect, it } from 'vitest';

describe('Stage Queue', () => {
  it('deve começar o primeiro estágio', () => {
    const factories = [new LegislativeStageFactory()];
    const queue = new StageQueue();
    const stage = queue.nextStage(factories);
    expect(stage?.type).toBe(StageType.LEGISLATIVE);
  });

  it('deve pular o primeiro estágio', () => {
    const factories = [
      new ImpeachmentStageFactory('1'),
      new LegislativeStageFactory(),
    ];
    const queue = new StageQueue();
    const stage = queue.nextStage(factories);
    expect(stage?.type).toBe(StageType.LEGISLATIVE);
  });

  it('deve começar pelo segundo estágio', () => {
    const factories = [
      new LegislativeStageFactory(),
      new DossierStageFactory([new Law('1', LawType.CONSERVADORES, '1')]),
    ];
    const queue = new StageQueue(1);
    const stage = queue.nextStage(factories);
    expect(stage?.type).toBe(StageType.REPORT_DOSSIER);
  });
  it('deve pular o segundo estágio', () => {
    const factories = [
      new LegislativeStageFactory(),
      new ImpeachmentStageFactory('1'),
      new DossierStageFactory([new Law('1', LawType.CONSERVADORES, '1')]),
    ];
    const queue = new StageQueue(1);
    const stage = queue.nextStage(factories);
    expect(stage?.type).toBe(StageType.REPORT_DOSSIER);
  });

  it('deve pular o segundo e o terceiro estágio', () => {
    const factories = [
      new LegislativeStageFactory(),
      new ImpeachmentStageFactory('1'),
      new ImpeachmentStageFactory('1'),
      new DossierStageFactory([new Law('1', LawType.CONSERVADORES, '1')]),
    ];
    const queue = new StageQueue(1);
    const stage = queue.nextStage(factories);
    expect(stage?.type).toBe(StageType.REPORT_DOSSIER);
  });

  it('deve retornar nulo se não houver mais estágios', () => {
    const factories = [new ImpeachmentStageFactory('1')];
    const queue = new StageQueue();
    const stage = queue.nextStage(factories);
    expect(stage).toBeNull();
  });
});
