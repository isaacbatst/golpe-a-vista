import { describe, expect, it } from 'vitest';
import { DossierAction, DossierStage } from './dossier-stage';
import { Player } from '../player';
import { LawType, Role } from '../role';
import { Law } from '../../data/laws';
import { makeLawsDeck } from '../mock';

describe('Estágio do Dossiê', () => {
  it('deve escolher o relator da próxima rodada', () => {
    const stage = new DossierStage({
      drawnLaws: [],
    });

    const nextRapporteur = new Player('p4', 'p4', Role.MODERADO);

    const [error] = stage.chooseNextRapporteur({
      chosen: nextRapporteur,
      currentPresident: new Player('p1', 'p1', Role.MODERADO),
      nextPresident: new Player('p2', 'p2', Role.MODERADO),
      currentRapporteur: new Player('p3', 'p3', Role.MODERADO),
    });
    expect(error).toBeUndefined();
    expect(stage.nextRapporteur).toBe(nextRapporteur.id);
  });

  it('não deve permitir que o relator da próxima rodada seja o presidente atual', () => {
    const president = new Player('p1', 'p1', Role.MODERADO);

    const stage = new DossierStage({
      drawnLaws: [],
    });

    const [error] = stage.chooseNextRapporteur({
      chosen: president,
      currentPresident: president,
      nextPresident: new Player('p2', 'p2', Role.MODERADO),
      currentRapporteur: new Player('p3', 'p3', Role.MODERADO),
    });
    expect(error).toBe('O presidente não pode ser o próximo relator');
  });

  it('não deve permitir que o relator da próxima rodada seja o relator atual', () => {
    const currentRapporteur = new Player('p3', 'p3', Role.MODERADO);

    const stage = new DossierStage({
      drawnLaws: [],
    });

    const [error] = stage.chooseNextRapporteur({
      currentPresident: new Player('p1', 'p1', Role.MODERADO),
      nextPresident: new Player('p2', 'p2', Role.MODERADO),
      currentRapporteur,
      chosen: currentRapporteur,
    });
    expect(error).toBe('O relator anterior não pode ser o relator');
  });

  it('não deve permitir que o relator da próxima rodada seja o próximo presidente', () => {
    const nextPresident = new Player('p2', 'p2', Role.MODERADO);

    const stage = new DossierStage({
      drawnLaws: [],
    });

    const [error] = stage.chooseNextRapporteur({
      currentPresident: new Player('p1', 'p1', Role.MODERADO),
      nextPresident,
      currentRapporteur: new Player('p3', 'p3', Role.MODERADO),
      chosen: nextPresident,
    });
    expect(error).toBe('O próximo presidente não pode ser o relator');
  });

  it('não deve permitir que o relator da próxima rodada tenha sido cassado', () => {
    const impeachedRapporteur = new Player('p3', 'p3', Role.MODERADO, true);

    const stage = new DossierStage({
      drawnLaws: [],
    });

    const [error] = stage.chooseNextRapporteur({
      chosen: impeachedRapporteur,
      currentPresident: new Player('p1', 'p1', Role.MODERADO),
      nextPresident: new Player('p2', 'p2', Role.MODERADO),
      currentRapporteur: new Player('p4', 'p4', Role.MODERADO),
    });
    expect(error).toBe('O relator não pode ter sido cassado');
  });

  it('deve passar o dossiê para o relator', () => {
    const stage = new DossierStage({
      drawnLaws: [],
    });
    const currentRapporteur = new Player('p3', 'p3', Role.MODERADO);

    stage.chooseNextRapporteur({
      currentPresident: new Player('p1', 'p1', Role.MODERADO),
      nextPresident: new Player('p2', 'p2', Role.MODERADO),
      currentRapporteur,
      chosen: new Player('p4', 'p4', Role.MODERADO),
    });
    const [error] = stage.passDossier(makeLawsDeck(), currentRapporteur);
    expect(error).toBeUndefined();
    expect(stage.isDossierVisibleToRapporteur).toBe(true);
  });

  it('deve conter leis sacadas pelo presidente', () => {
    const drawnLaws: Law[] = [
      new Law('Lei 1', LawType.PROGRESSISTAS, 'L1'),
      new Law('Lei 2', LawType.PROGRESSISTAS, 'L2'),
      new Law('Lei 3', LawType.PROGRESSISTAS, 'L3'),
    ];

    const stage = new DossierStage({
      drawnLaws,
    });

    expect(stage.dossier).toEqual(drawnLaws);
  });

  it('deve mostrar dossier falso se configurado', () => {
    const drawnLaws: Law[] = [
      new Law('Lei 1', LawType.PROGRESSISTAS, 'L1'),
      new Law('Lei 2', LawType.PROGRESSISTAS, 'L2'),
      new Law('Lei 3', LawType.PROGRESSISTAS, 'L3'),
    ];

    const stage = new DossierStage({
      drawnLaws,
      fakeDossier: true,
      currentAction: DossierAction.PASS_DOSSIER,
    });

    stage.passDossier(makeLawsDeck(), new Player('p3', 'p3', Role.MODERADO));

    expect(stage.dossier).not.toEqual(drawnLaws);
  });
});
