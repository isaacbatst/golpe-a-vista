import SABOTAGE_CARDS from 'src/data/sabotage-cards';
import { SabotageCard } from 'src/domain/sabotage-card/sabotage-card';
import { StageType } from 'src/domain/stage/stage';
import { describe, expect, it } from 'vitest';
import { Law } from '../data/laws';
import { makeSabotageCardsDeck, makeLawsDeck } from './mock';
import { Player } from './player';
import { PresidentQueue } from './president-queue';
import { LawType, Role } from './role';
import { Round } from './round';
import { SabotageCardStage } from './stage/sabotage-card-stage';
import { CPIAction, CPIStage } from './stage/cpi-stage';
import { ImpeachmentAction, ImpeachmentStage } from './stage/impeachment-stage';
import { LegislativeAction, LegislativeStage } from './stage/legislative-stage';
import { InterceptionAction, InterceptionStage } from './stage/interception-stage';
import { RoundStageIndex, StageQueue } from './stage/stage-queue';
import { LegislativeProposal } from 'src/domain/stage/legislative-proposal';

describe('Estágios', () => {
  it('Deve iniciar Estágio Legislativo', () => {
    const presidentQueue = new PresidentQueue([
      new Player('p1', 'p1', Role.MODERADO),
      new Player('p2', 'p2', Role.MODERADO),
    ]);
    const round = new Round({ presidentQueue });
    expect(round.currentStage?.type).toBe(StageType.LEGISLATIVE);
  });

  it('Deve iniciar com Impeachment caso esteja ativa nesta rodada', () => {
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

  it('Deve avançar de Impeachment para legislativo', () => {
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
          proposals: [
            new LegislativeProposal(
              new Law('1', LawType.PROGRESSISTAS, 'Lei 1'),
            ),
          ],
        }),
      ],
      stageQueue: new StageQueue(RoundStageIndex.CPI),
    });
    const [error, stage] = round.nextStage();
    expect(error).toBeUndefined();
    expect(stage?.type).toBe(StageType.CPI);
  });

  it('Deve finalizar round após o dossiê', () => {
    const presidentQueue = new PresidentQueue([
      new Player('p1', 'p1', Role.MODERADO),
      new Player('p2', 'p2', Role.MODERADO),
    ]);
    const round = new Round({
      presidentQueue,
      stageQueue: new StageQueue(RoundStageIndex.CPI),
      stages: [
        new CPIStage({
          proposals: [],
          currentAction: CPIAction.ADVANCE_STAGE,
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
    legislativeStage.endVoting();
    expect(legislativeStage.votingResult).toBe(true);
    const round = new Round({
      presidentQueue: new PresidentQueue([president, nextPresident]),
      stageQueue: new StageQueue(RoundStageIndex.INTERCEPTION),
      stages: [
        legislativeStage,
        new CPIStage({
          proposals: [],
          currentAction: CPIAction.ADVANCE_STAGE,
        }),
      ],
    });
    const [error, stage] = round.nextStage();
    expect(error).toBeUndefined();
    expect(stage?.type).toBe(StageType.INTERCEPTION);
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
      sabotageCard: new SabotageCard(SABOTAGE_CARDS.PLANO_COHEN),
      stageQueue: new StageQueue(RoundStageIndex.RADICALIZATION),
      stages: [
        new LegislativeStage({
          mustVeto: null,
          currentAction: LegislativeAction.ADVANCE_STAGE,
        }),
        new CPIStage({
          proposals: [],
          currentAction: CPIAction.ADVANCE_STAGE,
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
      sabotageCard: new SabotageCard(SABOTAGE_CARDS.PLANO_COHEN),
      stages: [new InterceptionStage(InterceptionAction.ADVANCE_STAGE)],
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
    const interceptionStage = new InterceptionStage();
    interceptionStage.drawSabotageCards(makeSabotageCardsDeck());
    interceptionStage.chooseSabotageCard(0);
    const round = new Round({
      presidentQueue: new PresidentQueue([president, nextPresident]),
      stages: [interceptionStage],
    });
    expect(round.interceptionSabotageCard).toBe(interceptionStage.selectedSabotageCard);
  });

  it('Deve retornar relator da próxima rodada', () => {
    const president = new Player('p1', 'p1', Role.MODERADO);
    const nextPresident = new Player('p2', 'p2', Role.MODERADO);
    const cpiStage = new CPIStage({
      proposals: [],
    });
    const nextRapporteur = new Player('p4', 'p4', Role.MODERADO);
    cpiStage.chooseNextRapporteur({
      chosen: nextRapporteur,
      currentPresident: president,
      nextPresident,
      currentRapporteur: new Player('p3', 'p3', Role.MODERADO),
    });
    const round = new Round({
      presidentQueue: new PresidentQueue([president, nextPresident]),
      stages: [cpiStage],
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
        index: 1,
        presidentQueue: new PresidentQueue([president, nextPresident]),
        sabotageCard: new SabotageCard(SABOTAGE_CARDS.PLANO_COHEN),
      });

      expect(round.currentStage.type).toBe(StageType.SABOTAGE_CARD);
      const sabotageCardStage = round.currentStage as SabotageCardStage;
      sabotageCardStage.applySabotageCard(round);
      expect(round.isObstructed).toBe(true);
    });
  });

  describe('Café Com a ABIN', () => {
    it('Não deve permitir que relator veja o dossiê', () => {
      const president = new Player('p1', 'p1', Role.MODERADO);
      const nextPresident = new Player('p2', 'p2', Role.MODERADO);
      const round = new Round({
        index: 1,
        presidentQueue: new PresidentQueue([president, nextPresident]),
        sabotageCard: new SabotageCard(SABOTAGE_CARDS.CAFE_COM_A_ABIN),
      });
      expect(round.currentStage.type).toBe(StageType.SABOTAGE_CARD);
      const sabotageCardStage = round.currentStage as SabotageCardStage;
      sabotageCardStage.applySabotageCard(round);
      expect(round.isCPIOmitted).toBe(true);
    });
  });

  describe.each([
    { name: 'FMI Mandou', factory: () => new SabotageCard(SABOTAGE_CARDS.O_FMI_MANDOU) },
    {
      name: 'Forças Ocultas',
      factory: () => new SabotageCard(SABOTAGE_CARDS.FORCAS_OCULTAS),
    },
  ])('$name', ({ factory }) => {
    it('Deve ser obrigatório vetar uma lei progressista', () => {
      const president = new Player('p1', 'p1', Role.MODERADO);
      const nextPresident = new Player('p2', 'p2', Role.MODERADO);
      const round = new Round({
        index: 1,
        presidentQueue: new PresidentQueue([president, nextPresident]),
        sabotageCard: factory(),
      });
      expect(round.currentStage.type).toBe(StageType.SABOTAGE_CARD);
      const sabotageCardStage = round.currentStage as SabotageCardStage;
      sabotageCardStage.applySabotageCard(round);
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
        index: 1,
        presidentQueue: new PresidentQueue([president, nextPresident]),
        sabotageCard: new SabotageCard(SABOTAGE_CARDS.SESSAO_SECRETA),
      });
      expect(round.currentStage.type).toBe(StageType.SABOTAGE_CARD);
      const sabotageCardStage = round.currentStage as SabotageCardStage;
      sabotageCardStage.applySabotageCard(round);
      expect(round.isLegislativeVotingSecret).toBe(true);
    });
  });
});
