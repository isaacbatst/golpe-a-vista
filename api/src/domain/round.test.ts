import { PlanoCohen } from './crisis/plano-cohen';
import { makeCrisesDeck, makeLawsDeck } from './mock';
import { Player } from './player';
import { LawType, Role } from './role';
import { Round } from './round';
import { DossierAction, DossierStage } from './stage/dossier-stage';
import { ImpeachmentAction, ImpeachmentStage } from './stage/impeachment-stage';
import { LegislativeAction, LegislativeStage } from './stage/legislative-stage';
import { RadicalizationStage } from './stage/radicalization-stage';
import { SabotageAction, SabotageStage } from './stage/sabotage-stage';
import { CafeComAbin } from './crisis/cafe-com-abin';
import { FmiMandou } from './crisis/fmi-mandou';
import { ForcasOcultas } from './crisis/forcas-ocultas';
import { SessaoSecreta } from './crisis/sessao-secreta';
import { CrisisStage } from './stage/crisis-stage';
import { PresidentQueue } from './president-queue';
import { describe, expect, it } from 'vitest';
import { Law } from '../data/laws';

describe('Estágios', () => {
  it('Deve iniciar Estágio Legislativo', () => {
    const presidentQueue = new PresidentQueue([
      new Player('p1', 'p1', Role.MODERADO),
      new Player('p2', 'p2', Role.MODERADO),
    ]);
    const lawsDeck = makeLawsDeck();
    const crisesDeck = makeCrisesDeck();
    const round = new Round({ presidentQueue, lawsDeck, crisesDeck });
    expect(round.currentStage).toBeInstanceOf(LegislativeStage);
  });

  it('Deve iniciar com Cassação caso esteja ativa nesta rodada', () => {
    const presidentQueue = new PresidentQueue([
      new Player('p1', 'p1', Role.MODERADO),
      new Player('p2', 'p2', Role.MODERADO),
    ]);
    const lawsDeck = makeLawsDeck();
    const crisesDeck = makeCrisesDeck();
    const round = new Round({
      presidentQueue,
      lawsDeck,
      crisesDeck,
      hasImpeachment: true,
    });
    expect(round.currentStage).toBeInstanceOf(ImpeachmentStage);
  });

  it('Deve avançar de cassação para legislativo', () => {
    const presidentQueue = new PresidentQueue([
      new Player('p1', 'p1', Role.MODERADO),
      new Player('p2', 'p2', Role.MODERADO),
    ]);
    const lawsDeck = makeLawsDeck();
    const crisesDeck = makeCrisesDeck();
    const round = new Round({
      presidentQueue,
      lawsDeck,
      crisesDeck,
      stages: [
        new ImpeachmentStage(
          presidentQueue.getByRoundNumber(0),
          false,
          false,
          ImpeachmentAction.ADVANCE_STAGE,
        ),
      ],
      hasImpeachment: true,
    });
    const [error, stage] = round.nextStage();
    expect(error).toBeUndefined();
    expect(stage).toBeInstanceOf(LegislativeStage);
  });

  it('Não deve avançar para o Dossiê sem finalizar o Estágio Legislativo', () => {
    const presidentQueue = new PresidentQueue([
      new Player('p1', 'p1', Role.MODERADO),
      new Player('p2', 'p2', Role.MODERADO),
    ]);
    const lawsDeck = makeLawsDeck();
    const crisesDeck = makeCrisesDeck();
    const round = new Round({ presidentQueue, lawsDeck, crisesDeck });
    const [error] = round.nextStage();
    expect(error).toBe('Estágio atual não finalizado');
  });

  it('Deve avançar para o estágio do Dossiê', () => {
    const presidentQueue = new PresidentQueue([
      new Player('p1', 'p1', Role.MODERADO),
      new Player('p2', 'p2', Role.MODERADO),
    ]);
    const lawsDeck = makeLawsDeck();
    const crisesDeck = makeCrisesDeck();
    const round = new Round({
      presidentQueue,
      lawsDeck,
      crisesDeck,
      stages: [
        new LegislativeStage({
          lawsDeck,
          currentAction: LegislativeAction.ADVANCE_STAGE,
        }),
      ],
    });
    const [error, stage] = round.nextStage();
    expect(error).toBeUndefined();
    expect(stage).toBeInstanceOf(DossierStage);
  });

  it('Deve finalizar round após o dossiê', () => {
    const presidentQueue = new PresidentQueue([
      new Player('p1', 'p1', Role.MODERADO),
      new Player('p2', 'p2', Role.MODERADO),
    ]);
    const lawsDeck = makeLawsDeck();
    const crisesDeck = makeCrisesDeck();
    const round = new Round({
      presidentQueue,
      lawsDeck,
      crisesDeck,
      stages: [
        new DossierStage({
          currentPresident: presidentQueue.getByRoundNumber(0),
          nextPresident: presidentQueue.getByRoundNumber(1),
          currentRapporteur: null,
          drawnLaws: [],
          currentAction: DossierAction.ADVANCE_STAGE,
          lawsDeck,
        }),
      ],
    });
    const [error, stage] = round.nextStage();
    expect(error).toBeUndefined();
    expect(stage).toBeNull();
    expect(round.finished).toBe(true);
  });

  it('Deve avançar do Dossiê para o estágio da Sabotagem se uma lei progressista foi aprovada e a rodada anterior não foi sabotada', () => {
    const president = new Player('p1', 'p1', Role.MODERADO);
    const nextPresident = new Player('p2', 'p2', Role.MODERADO);
    const lawsDeck = makeLawsDeck('progressive');
    const crisesDeck = makeCrisesDeck();
    const players = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6'];
    const legislativeStage = new LegislativeStage({
      lawsDeck,
    });
    const [drawLawsError] = legislativeStage.drawLaws();
    expect(drawLawsError).toBeUndefined();
    const [vetoLawError] = legislativeStage.vetoLaw(0);
    expect(vetoLawError).toBeUndefined();
    const [chooseLawForVotingError] = legislativeStage.chooseLawForVoting(1);
    expect(chooseLawForVotingError).toBeUndefined();
    const [startVotingError] = legislativeStage.startVoting(players);
    expect(startVotingError).toBeUndefined();
    for (const player of players) {
      const [error] = legislativeStage.vote(player, true);
      expect(error).toBeUndefined();
    }
    expect(legislativeStage.votingResult).toBe(true);
    const round = new Round({
      presidentQueue: new PresidentQueue([president, nextPresident]),
      lawsDeck,
      crisesDeck,
      stages: [
        legislativeStage,
        new DossierStage({
          currentPresident: president,
          nextPresident,
          currentRapporteur: null,
          drawnLaws: [],
          currentAction: DossierAction.ADVANCE_STAGE,
          lawsDeck,
        }),
      ],
      hasLastRoundBeenSabotaged: false,
    });
    const [error, stage] = round.nextStage();
    expect(error).toBeUndefined();
    expect(stage).toBeInstanceOf(SabotageStage);
  });

  it('Deve avançar do Dossiê para o estágio de Radicalização se não houver Sabotagem, pelo menos X leis progressistas ou Y leis conservadoras foram ativadas e a rodada atual tiver uma crise', () => {
    const president = new Player('p1', 'p1', Role.MODERADO);
    const nextPresident = new Player('p2', 'p2', Role.MODERADO);
    const lawsDeck = makeLawsDeck('progressive');
    const crisesDeck = makeCrisesDeck();
    const round = new Round({
      presidentQueue: new PresidentQueue([president, nextPresident]),
      lawsDeck,
      crisesDeck,
      minRadicalizationConservativeLaws: 2,
      minRadicalizationProgressiveLaws: 2,
      previouslyApprovedConservativeLaws: 2,
      previouslyApprovedProgressiveLaws: 2,
      crisis: new PlanoCohen(),
      stages: [
        new LegislativeStage({
          lawsDeck,
          mustVeto: null,
          currentAction: LegislativeAction.ADVANCE_STAGE,
        }),
        new DossierStage({
          currentPresident: president,
          nextPresident,
          currentRapporteur: null,
          drawnLaws: [],
          currentAction: DossierAction.ADVANCE_STAGE,
          lawsDeck,
        }),
      ],
    });
    const [error, stage] = round.nextStage();
    expect(error).toBeUndefined();
    expect(stage).toBeInstanceOf(RadicalizationStage);
  });

  it('Deve avançar do estágio de Sabotagem para o estágio de Radicalização se a rodada anterior foi sabotada e cumprir as condições de radicalização', () => {
    const president = new Player('p1', 'p1', Role.MODERADO);
    const nextPresident = new Player('p2', 'p2', Role.MODERADO);
    const lawsDeck = makeLawsDeck('progressive');
    const crisesDeck = makeCrisesDeck();
    const round = new Round({
      presidentQueue: new PresidentQueue([president, nextPresident]),
      lawsDeck,
      crisesDeck,
      minRadicalizationConservativeLaws: 2,
      minRadicalizationProgressiveLaws: 2,
      previouslyApprovedConservativeLaws: 2,
      previouslyApprovedProgressiveLaws: 2,
      crisis: new PlanoCohen(),
      stages: [new SabotageStage(crisesDeck, SabotageAction.ADVANCE_STAGE)],
      hasLastRoundBeenSabotaged: true,
    });
    const [error, stage] = round.nextStage();
    expect(error).toBeUndefined();
    expect(stage).toBeInstanceOf(RadicalizationStage);
  });

  it('Deve retornar a crise selecionada na sabotagem', () => {
    const president = new Player('p1', 'p1', Role.MODERADO);
    const nextPresident = new Player('p2', 'p2', Role.MODERADO);
    const lawsDeck = makeLawsDeck();
    const crisesDeck = makeCrisesDeck();
    const sabotageStage = new SabotageStage(crisesDeck);
    sabotageStage.drawCrises();
    sabotageStage.chooseSabotageCrisis(0);
    const round = new Round({
      presidentQueue: new PresidentQueue([president, nextPresident]),
      lawsDeck,
      crisesDeck,
      stages: [sabotageStage],
    });
    expect(round.sabotageCrisis).toBe(sabotageStage.selectedCrisis);
  });

  it('Deve retornar relator da próxima rodada', () => {
    const president = new Player('p1', 'p1', Role.MODERADO);
    const nextPresident = new Player('p2', 'p2', Role.MODERADO);
    const lawsDeck = makeLawsDeck();
    const crisesDeck = makeCrisesDeck();
    const dossierStage = new DossierStage({
      currentPresident: president,
      nextPresident,
      currentRapporteur: new Player('p3', 'p3', Role.MODERADO),
      drawnLaws: [],
      lawsDeck,
    });
    const nextRapporteur = new Player('p4', 'p4', Role.MODERADO);
    dossierStage.chooseNextRapporteur(nextRapporteur);
    const round = new Round({
      presidentQueue: new PresidentQueue([president, nextPresident]),
      lawsDeck,
      crisesDeck,
      stages: [dossierStage],
      rapporteur: new Player('p3', 'p3', Role.MODERADO),
    });
    expect(round.nextRapporteur).toBe(nextRapporteur);
  });
});

describe('Crises', () => {
  describe('Plano Cohen', () => {
    it('Deve gerar dossiê falso para o relator', () => {
      const president = new Player('p1', 'p1', Role.MODERADO);
      const nextPresident = new Player('p2', 'p2', Role.MODERADO);
      const lawsDeck = makeLawsDeck();
      const crisesDeck = makeCrisesDeck();
      const round = new Round({
        presidentQueue: new PresidentQueue([president, nextPresident]),
        lawsDeck,
        crisesDeck,
        crisis: new PlanoCohen(),
      });

      expect(round.currentStage).toBeInstanceOf(CrisisStage);
      const crisisStage = round.currentStage as CrisisStage;
      crisisStage.executeEffect(round);
      expect(round.isDossierFake).toBe(true);
    });
  });

  describe('Café Com a ABIN', () => {
    it('Não deve permitir que relator veja o dossiê', () => {
      const president = new Player('p1', 'p1', Role.MODERADO);
      const nextPresident = new Player('p2', 'p2', Role.MODERADO);
      const lawsDeck = makeLawsDeck();
      const crisesDeck = makeCrisesDeck();
      const round = new Round({
        presidentQueue: new PresidentQueue([president, nextPresident]),
        lawsDeck,
        crisesDeck,
        crisis: new CafeComAbin(),
      });
      expect(round.currentStage).toBeInstanceOf(CrisisStage);
      const crisisStage = round.currentStage as CrisisStage;
      crisisStage.executeEffect(round);
      expect(round.isDossierOmitted).toBe(true);
    });
  });

  describe.each([
    { name: 'FMI Mandou', factory: () => new FmiMandou() },
    { name: 'Forças Ocultas', factory: () => new ForcasOcultas() },
  ])('$name', ({ factory }) => {
    it('Deve ser obrigatório vetar uma lei progressista', () => {
      const president = new Player('p1', 'p1', Role.MODERADO);
      const nextPresident = new Player('p2', 'p2', Role.MODERADO);
      const cards = Array.from(
        { length: 3 },
        (_, i) =>
          new Law(
            `Lei ${i + 1}`,
            i === 0 ? LawType.PROGRESSISTAS : LawType.CONSERVADORES,
            `L${i + 1}`,
          ),
      );
      const lawsDeck = makeLawsDeck(cards);
      const crisesDeck = makeCrisesDeck();
      const round = new Round({
        presidentQueue: new PresidentQueue([president, nextPresident]),
        lawsDeck,
        crisesDeck,
        crisis: factory(),
      });
      expect(round.currentStage).toBeInstanceOf(CrisisStage);
      const crisisStage = round.currentStage as CrisisStage;
      crisisStage.executeEffect(round);
      expect(round.requiredVeto).toBe(LawType.PROGRESSISTAS);
      const [nextStageError] = round.nextStage();
      expect(nextStageError).toBeUndefined();
      expect(round.currentStage).toBeInstanceOf(LegislativeStage);
      const legislativeStage = round.currentStage as LegislativeStage;
      expect(legislativeStage.mustVeto).toBe(LawType.PROGRESSISTAS);
    });
  });

  describe('Sessão Secreta', () => {
    it('Deve fazer votação legislativa secreta', () => {
      const president = new Player('p1', 'p1', Role.MODERADO);
      const nextPresident = new Player('p2', 'p2', Role.MODERADO);
      const lawsDeck = makeLawsDeck();
      const crisesDeck = makeCrisesDeck();
      const round = new Round({
        presidentQueue: new PresidentQueue([president, nextPresident]),
        lawsDeck,
        crisesDeck,
        crisis: new SessaoSecreta(),
      });
      expect(round.currentStage).toBeInstanceOf(CrisisStage);
      const crisisStage = round.currentStage as CrisisStage;
      crisisStage.executeEffect(round);
      expect(round.isLegislativeVotingSecret).toBe(true);
    });
  });
});
