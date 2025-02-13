import { describe, expect, it } from 'vitest';
import { DossierStage } from './dossier-stage';
import { Player } from '../player';
import { LawType, Role } from '../role';
import { Law } from '../../data/laws';
import { makeLawsDeck } from '../mock';

describe('Estágio do Dossiê', () => {
  it('deve escolher o relator da próxima rodada', () => {
    const stage = new DossierStage({
      currentPresident: new Player('p1', 'p1', Role.MODERADO),
      nextPresident: new Player('p2', 'p2', Role.MODERADO),
      currentRapporteur: new Player('p3', 'p3', Role.MODERADO),
      drawnLaws: [],
      lawsDeck: makeLawsDeck(),
    });

    const nextRapporteur = new Player('p4', 'p4', Role.MODERADO);

    const [error] = stage.chooseNextRapporteur(nextRapporteur);
    expect(error).toBeUndefined();
    expect(stage.nextRapporteur).toBe(nextRapporteur);
  });

  it('não deve permitir que o relator da próxima rodada seja o presidente atual', () => {
    const president = new Player('p1', 'p1', Role.MODERADO);

    const stage = new DossierStage({
      currentPresident: president,
      nextPresident: new Player('p2', 'p2', Role.MODERADO),
      currentRapporteur: new Player('p3', 'p3', Role.MODERADO),
      drawnLaws: [],
      lawsDeck: makeLawsDeck(),
    });

    const [error] = stage.chooseNextRapporteur(president);
    expect(error).toBe('O presidente não pode ser o próximo relator');
  });

  it('não deve permitir que o relator da próxima rodada seja o relator atual', () => {
    const currentRapporteur = new Player('p3', 'p3', Role.MODERADO);

    const stage = new DossierStage({
      currentPresident: new Player('p1', 'p1', Role.MODERADO),
      nextPresident: new Player('p2', 'p2', Role.MODERADO),
      currentRapporteur,
      drawnLaws: [],
      lawsDeck: makeLawsDeck(),
    });

    const [error] = stage.chooseNextRapporteur(currentRapporteur);
    expect(error).toBe('O relator anterior não pode ser o relator');
  });

  it('não deve permitir que o relator da próxima rodada seja o próximo presidente', () => {
    const nextPresident = new Player('p2', 'p2', Role.MODERADO);

    const stage = new DossierStage({
      currentPresident: new Player('p1', 'p1', Role.MODERADO),
      nextPresident,
      currentRapporteur: new Player('p3', 'p3', Role.MODERADO),
      drawnLaws: [],
      lawsDeck: makeLawsDeck(),
    });

    const [error] = stage.chooseNextRapporteur(nextPresident);
    expect(error).toBe('O próximo presidente não pode ser o relator');
  });

  it('não deve permitir que o relator da próxima rodada tenha sido cassado', () => {
    const impeachedRapporteur = new Player('p3', 'p3', Role.MODERADO, true);

    const stage = new DossierStage({
      currentPresident: new Player('p1', 'p1', Role.MODERADO),
      nextPresident: new Player('p2', 'p2', Role.MODERADO),
      currentRapporteur: new Player('p4', 'p4', Role.MODERADO),
      drawnLaws: [],
      lawsDeck: makeLawsDeck(),
    });

    const [error] = stage.chooseNextRapporteur(impeachedRapporteur);
    expect(error).toBe('O relator não pode ter sido cassado');
  });

  it('deve passar o dossiê para o relator', () => {
    const stage = new DossierStage({
      currentPresident: new Player('p1', 'p1', Role.MODERADO),
      nextPresident: new Player('p2', 'p2', Role.MODERADO),
      currentRapporteur: new Player('p3', 'p3', Role.MODERADO),
      drawnLaws: [],
      lawsDeck: makeLawsDeck(),
    });

    stage.chooseNextRapporteur(new Player('p4', 'p4', Role.MODERADO));
    const [error] = stage.passDossier();
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
      currentPresident: new Player('p1', 'p1', Role.MODERADO),
      nextPresident: new Player('p2', 'p2', Role.MODERADO),
      currentRapporteur: new Player('p3', 'p3', Role.MODERADO),
      drawnLaws,
      lawsDeck: makeLawsDeck(),
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
      currentPresident: new Player('p1', 'p1', Role.MODERADO),
      nextPresident: new Player('p2', 'p2', Role.MODERADO),
      currentRapporteur: new Player('p3', 'p3', Role.MODERADO),
      drawnLaws,
      lawsDeck: makeLawsDeck(),
      fakeDossier: true,
    });

    expect(stage.dossier).not.toEqual(drawnLaws);
  });
});
