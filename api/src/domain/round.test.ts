import { StageType } from 'src/domain/stage/stage';
import { describe, expect, it } from 'vitest';
import { Law } from '../data/laws';
import { CafeComAbin } from './crisis/cafe-com-abin';
import { FmiMandou } from './crisis/fmi-mandou';
import { ForcasOcultas } from './crisis/forcas-ocultas';
import { PlanoCohen } from './crisis/plano-cohen';
import { SessaoSecreta } from './crisis/sessao-secreta';
import { makeCrisesDeck, makeLawsDeck } from './mock';
import { Player } from './player';
import { PresidentQueue } from './president-queue';
import { LawType, Role } from './role';
import { Round } from './round';
import { CrisisStage } from './stage/crisis-stage';
import { DossierAction, DossierStage } from './stage/dossier-stage';
import { ImpeachmentAction, ImpeachmentStage } from './stage/impeachment-stage';
import { LegislativeAction, LegislativeStage } from './stage/legislative-stage';
import { SabotageAction, SabotageStage } from './stage/sabotage-stage';
import { RoundStageIndex, StageQueue } from './stage/stage-queue';

describe('Estágios', () => {
  it('Deve iniciar Estágio Legislativo', () => {
    const presidentQueue = new PresidentQueue([
      new Player('p1', 'p1', Role.MODERADO),
      new Player('p2', 'p2', Role.MODERADO),
    ]);
    const round = new Round({ presidentQueue });
    expect(round.currentStage?.type).toBe(StageType.LEGISLATIVE);
  });

  it('Deve iniciar com Cassação caso esteja ativa nesta rodada', () => {
    const presidentQueue = new PresidentQueue([
      new Player('p1', 'p1', Role.MODERADO),
      new Player('p2', 'p2', Role.MODERADO),
    ]);
    const round = new Round({
      presidentQueue,
      hasImpeachment: true,
    });
    expect(round.currentStage?.type).toBe(StageType.IMPEACHMENT);
  });

  it('Deve avançar de cassação para legislativo', () => {
    const presidentQueue = new PresidentQueue([
      new Player('p1', 'p1', Role.MODERADO),
      new Player('p2', 'p2', Role.MODERADO),
    ]);
    const round = new Round({
      presidentQueue,
      stages: [
        new ImpeachmentStage(
          presidentQueue.getByRoundNumber(0).id,
          false,
          false,
          ImpeachmentAction.ADVANCE_STAGE,
        ),
      ],
      stageQueue: new StageQueue(1),
      hasImpeachment: true,
    });
    const [error, stage] = round.nextStage();
    expect(error).toBeUndefined();
    expect(stage?.type).toBe(StageType.LEGISLATIVE);
  });

  it('Não deve avançar para o Dossiê sem finalizar o Estágio Legislativo', () => {
    const presidentQueue = new PresidentQueue([
      new Player('p1', 'p1', Role.MODERADO),
      new Player('p2', 'p2', Role.MODERADO),
    ]);
    const round = new Round({ presidentQueue });
    const [error] = round.nextStage();
    expect(error).toBe('Estágio atual não finalizado');
  });

  it('Deve avançar para o estágio do Dossiê', () => {
    const presidentQueue = new PresidentQueue([
      new Player('p1', 'p1', Role.MODERADO),
      new Player('p2', 'p2', Role.MODERADO),
    ]);
    const round = new Round({
      presidentQueue,
      stages: [
        new LegislativeStage({
          currentAction: LegislativeAction.ADVANCE_STAGE,
          drawnLaws: [new Law('1', LawType.PROGRESSISTAS, 'Lei 1')],
        }),
      ],
      stageQueue: new StageQueue(RoundStageIndex.DOSSIER),
    });
    const [error, stage] = round.nextStage();
    expect(error).toBeUndefined();
    expect(stage?.type).toBe(StageType.REPORT_DOSSIER);
  });

  it('Deve finalizar round após o dossiê', () => {
    const presidentQueue = new PresidentQueue([
      new Player('p1', 'p1', Role.MODERADO),
      new Player('p2', 'p2', Role.MODERADO),
    ]);
    const round = new Round({
      presidentQueue,
      stageQueue: new StageQueue(RoundStageIndex.DOSSIER),
      stages: [
        new DossierStage({
          drawnLaws: [],
          currentAction: DossierAction.ADVANCE_STAGE,
        }),
      ],
    });

    const [error, stage] = round.nextStage();
    expect(error).toBeUndefined();
    expect(stage).toBeNull();
  });

  it('Deve avançar do Dossiê para o estágio da Sabotagem se uma lei progressista foi aprovada e a rodada anterior não foi sabotada', () => {
    const president = new Player('p1', 'p1', Role.MODERADO);
    const nextPresident = new Player('p2', 'p2', Role.MODERADO);
    const players = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6'];
    const legislativeStage = new LegislativeStage();
    const [drawLawsError] = legislativeStage.drawLaws(
      makeLawsDeck('progressive'),
      president.id,
      president.id,
    );
    expect(drawLawsError).toBeUndefined();
    const [vetoLawError] = legislativeStage.vetoLaw(
      0,
      president.id,
      president.id,
    );
    expect(vetoLawError).toBeUndefined();
    const [chooseLawForVotingError] = legislativeStage.chooseLawForVoting(
      1,
      president.id,
      president.id,
    );
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
      stageQueue: new StageQueue(RoundStageIndex.SABOTAGE),
      stages: [
        legislativeStage,
        new DossierStage({
          drawnLaws: [],
          currentAction: DossierAction.ADVANCE_STAGE,
        }),
      ],
    });
    const [error, stage] = round.nextStage();
    expect(error).toBeUndefined();
    expect(stage?.type).toBe(StageType.SABOTAGE);
  });

  it('Deve avançar do Dossiê para o estágio de Radicalização se não houver Sabotagem, pelo menos X leis progressistas ou Y leis conservadoras foram ativadas e a rodada atual tiver uma crise', () => {
    const president = new Player('p1', 'p1', Role.MODERADO);
    const nextPresident = new Player('p2', 'p2', Role.MODERADO);
    const round = new Round({
      presidentQueue: new PresidentQueue([president, nextPresident]),
      minRadicalizationConservativeLaws: 2,
      minRadicalizationProgressiveLaws: 2,
      previouslyApprovedConservativeLaws: 2,
      previouslyApprovedProgressiveLaws: 2,
      crisis: new PlanoCohen(),
      stageQueue: new StageQueue(RoundStageIndex.RADICALIZATION),
      stages: [
        new LegislativeStage({
          mustVeto: null,
          currentAction: LegislativeAction.ADVANCE_STAGE,
        }),
        new DossierStage({
          drawnLaws: [],
          currentAction: DossierAction.ADVANCE_STAGE,
        }),
      ],
    });
    const [error, stage] = round.nextStage();
    expect(error).toBeUndefined();
    expect(stage?.type).toBe(StageType.RADICALIZATION);
  });

  it('Deve avançar do estágio de Sabotagem para o estágio de Radicalização se a rodada anterior foi sabotada e cumprir as condições de radicalização', () => {
    const president = new Player('p1', 'p1', Role.MODERADO);
    const nextPresident = new Player('p2', 'p2', Role.MODERADO);
    const round = new Round({
      presidentQueue: new PresidentQueue([president, nextPresident]),
      minRadicalizationConservativeLaws: 2,
      minRadicalizationProgressiveLaws: 2,
      previouslyApprovedConservativeLaws: 2,
      previouslyApprovedProgressiveLaws: 2,
      crisis: new PlanoCohen(),
      stages: [new SabotageStage(SabotageAction.ADVANCE_STAGE)],
      stageQueue: new StageQueue(RoundStageIndex.RADICALIZATION),
      hasLastRoundBeenSabotaged: true,
    });
    const [error, stage] = round.nextStage();
    expect(error).toBeUndefined();
    expect(stage?.type).toBe(StageType.RADICALIZATION);
  });

  it('Deve retornar a crise selecionada na sabotagem', () => {
    const president = new Player('p1', 'p1', Role.MODERADO);
    const nextPresident = new Player('p2', 'p2', Role.MODERADO);
    const sabotageStage = new SabotageStage();
    sabotageStage.drawCrises(makeCrisesDeck());
    sabotageStage.chooseSabotageCrisis(0);
    const round = new Round({
      presidentQueue: new PresidentQueue([president, nextPresident]),
      stages: [sabotageStage],
    });
    expect(round.sabotageCrisis).toBe(sabotageStage.selectedCrisis);
  });

  it('Deve retornar relator da próxima rodada', () => {
    const president = new Player('p1', 'p1', Role.MODERADO);
    const nextPresident = new Player('p2', 'p2', Role.MODERADO);
    const dossierStage = new DossierStage({
      drawnLaws: [],
    });
    const nextRapporteur = new Player('p4', 'p4', Role.MODERADO);
    dossierStage.chooseNextRapporteur({
      chosen: nextRapporteur,
      currentPresident: president,
      nextPresident,
      currentRapporteur: new Player('p3', 'p3', Role.MODERADO),
    });
    const round = new Round({
      presidentQueue: new PresidentQueue([president, nextPresident]),
      stages: [dossierStage],
      rapporteurId: 'p3',
    });
    expect(round.nextRapporteur).toBe(nextRapporteur.id);
  });
});

describe('Crises', () => {
  describe('Plano Cohen', () => {
    it('Deve gerar dossiê falso para o relator', () => {
      const president = new Player('p1', 'p1', Role.MODERADO);
      const nextPresident = new Player('p2', 'p2', Role.MODERADO);
      const round = new Round({
        presidentQueue: new PresidentQueue([president, nextPresident]),
        crisis: new PlanoCohen(),
      });

      expect(round.currentStage.type).toBe(StageType.CRISIS);
      const crisisStage = round.currentStage as CrisisStage;
      crisisStage.executeEffect(round);
      expect(round.isDossierFake).toBe(true);
    });
  });

  describe('Café Com a ABIN', () => {
    it('Não deve permitir que relator veja o dossiê', () => {
      const president = new Player('p1', 'p1', Role.MODERADO);
      const nextPresident = new Player('p2', 'p2', Role.MODERADO);
      const round = new Round({
        presidentQueue: new PresidentQueue([president, nextPresident]),
        crisis: new CafeComAbin(),
      });
      expect(round.currentStage.type).toBe(StageType.CRISIS);
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
      const round = new Round({
        presidentQueue: new PresidentQueue([president, nextPresident]),
        crisis: factory(),
      });
      expect(round.currentStage.type).toBe(StageType.CRISIS);
      const crisisStage = round.currentStage as CrisisStage;
      crisisStage.executeEffect(round);
      expect(round.requiredVeto).toBe(LawType.PROGRESSISTAS);
      const [nextStageError] = round.nextStage();
      expect(nextStageError).toBeUndefined();
      expect(round.currentStage.type).toBe(StageType.LEGISLATIVE);
      const legislativeStage = round.currentStage as LegislativeStage;
      expect(legislativeStage.mustVeto).toBe(LawType.PROGRESSISTAS);
    });
  });

  describe('Sessão Secreta', () => {
    it('Deve fazer votação legislativa secreta', () => {
      const president = new Player('p1', 'p1', Role.MODERADO);
      const nextPresident = new Player('p2', 'p2', Role.MODERADO);
      const round = new Round({
        presidentQueue: new PresidentQueue([president, nextPresident]),
        crisis: new SessaoSecreta(),
      });
      expect(round.currentStage.type).toBe(StageType.CRISIS);
      const crisisStage = round.currentStage as CrisisStage;
      crisisStage.executeEffect(round);
      expect(round.isLegislativeVotingSecret).toBe(true);
    });
  });
});
