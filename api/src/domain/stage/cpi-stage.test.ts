import { describe, expect, it } from 'vitest';
import { CPIAction, CPIStage } from './cpi-stage';
import { Player } from '../player';
import { LawType, Role } from '../role';
import { Law } from '../../data/laws';
import { makeLawsDeck } from '../mock';
import { LegislativeProposal } from 'src/domain/stage/legislative-proposal';

describe('Estágio da CPI', () => {
  it('deve escolher o relator da próxima rodada', () => {
    const stage = new CPIStage({
      proposals: [],
    });

    const nextRapporteur = new Player('p4', 'p4', Role.MODERADO);

    const [error] = stage.chooseNextRapporteur({
      chosen: nextRapporteur,
      currentPresident: new Player('p1', 'p1', Role.MODERADO).id,
      nextPresident: new Player('p2', 'p2', Role.MODERADO),
      currentRapporteur: new Player('p3', 'p3', Role.MODERADO),
    });
    expect(error).toBeUndefined();
    expect(stage.nextRapporteur).toBe(nextRapporteur.id);
  });

  it('não deve permitir que o relator da próxima rodada seja o presidente atual', () => {
    const president = new Player('p1', 'p1', Role.MODERADO);

    const stage = new CPIStage({
      proposals: [],
    });

    const [error] = stage.chooseNextRapporteur({
      chosen: president,
      currentPresident: president.id,
      nextPresident: new Player('p2', 'p2', Role.MODERADO),
      currentRapporteur: new Player('p3', 'p3', Role.MODERADO),
    });
    expect(error).toBe('O presidente não pode ser o próximo relator');
  });

  it('não deve permitir que o relator da próxima rodada seja o relator atual', () => {
    const currentRapporteur = new Player('p3', 'p3', Role.MODERADO);

    const stage = new CPIStage({
      proposals: [],
    });

    const [error] = stage.chooseNextRapporteur({
      currentPresident: new Player('p1', 'p1', Role.MODERADO).id,
      nextPresident: new Player('p2', 'p2', Role.MODERADO),
      currentRapporteur,
      chosen: currentRapporteur,
    });
    expect(error).toBe('O relator atual não pode ser o próximo relator');
  });

  it('não deve permitir que o relator da próxima rodada seja o próximo presidente', () => {
    const nextPresident = new Player('p2', 'p2', Role.MODERADO);

    const stage = new CPIStage({
      proposals: [],
    });

    const [error] = stage.chooseNextRapporteur({
      currentPresident: new Player('p1', 'p1', Role.MODERADO).id,
      nextPresident,
      currentRapporteur: new Player('p3', 'p3', Role.MODERADO),
      chosen: nextPresident,
    });
    expect(error).toBe('O próximo presidente não pode ser o relator');
  });

  it('não deve permitir que o relator da próxima rodada tenha sido cassado', () => {
    const impeachedRapporteur = new Player('p3', 'p3', Role.MODERADO, true);

    const stage = new CPIStage({
      proposals: [],
    });

    const [error] = stage.chooseNextRapporteur({
      chosen: impeachedRapporteur,
      currentPresident: new Player('p1', 'p1', Role.MODERADO).id,
      nextPresident: new Player('p2', 'p2', Role.MODERADO),
      currentRapporteur: new Player('p4', 'p4', Role.MODERADO),
    });
    expect(error).toBe('O relator não pode ter sido cassado');
  });

  it('deve entregar a CPI para o relator', () => {
    const stage = new CPIStage({
      proposals: [],
    });
    const currentRapporteur = new Player('p3', 'p3', Role.MODERADO);

    stage.chooseNextRapporteur({
      currentPresident: new Player('p1', 'p1', Role.MODERADO).id,
      nextPresident: new Player('p2', 'p2', Role.MODERADO),
      currentRapporteur,
      chosen: new Player('p4', 'p4', Role.MODERADO),
    });
    const [error] = stage.deliverCPI(makeLawsDeck(), currentRapporteur);
    expect(error).toBeUndefined();
    expect(stage.isCPIVisibleToRapporteur).toBe(true);
  });

  it('deve conter leis sacadas pelo presidente, excluindo a lei vetada', () => {
    const drawnLaws: LegislativeProposal[] = [
      new LegislativeProposal(new Law('Lei 1', LawType.PROGRESSISTAS, 'L1')),
      new LegislativeProposal(new Law('Lei 2', LawType.PROGRESSISTAS, 'L2')),
      new LegislativeProposal(
        new Law('Lei 3', LawType.PROGRESSISTAS, 'L3'),
        true,
      ),
    ];

    const stage = new CPIStage({
      proposals: drawnLaws,
    });

    expect(stage.cpiReport).toHaveLength(2);
  });

  it('deve mostrar CPI obstruída se configurado', () => {
    const drawnLaws: LegislativeProposal[] = [
      new LegislativeProposal(new Law('Lei 1', LawType.PROGRESSISTAS, 'PL1')),
      new LegislativeProposal(new Law('Lei 2', LawType.PROGRESSISTAS, 'PL2')),
      new LegislativeProposal(
        new Law('Lei 3', LawType.PROGRESSISTAS, 'PL3'),
        true,
      ),
    ];

    const stage = new CPIStage({
      proposals: drawnLaws,
      obstructed: true,
      currentAction: CPIAction.DELIVER_CPI,
    });

    stage.deliverCPI(makeLawsDeck(), new Player('p3', 'p3', Role.MODERADO));
    expect(stage.cpiReport.length).toBe(2);
    expect(stage.cpiReport.find((l) => l.id === 'PL1')).toBeUndefined();
    expect(stage.cpiReport.find((l) => l.id === 'PL2')).toBeUndefined();
  });
});
