import SABOTAGE_CARDS from 'src/data/sabotage-cards';
import { SabotageCard } from 'src/domain/sabotage-card/sabotage-card';
import { StageType } from 'src/domain/stage/stage';
import { describe, expect, it } from 'vitest';
import { Game } from './game';
import { makeSabotageCardsDeck, makeLawsDeck } from './mock';
import { PresidentQueue } from './president-queue';
import { LawType, Role } from './role';
import { Round } from './round';
import { CPIStage } from './stage/cpi-stage';
import { ImpeachmentStage } from './stage/impeachment-stage';
import { LegislativeAction, LegislativeStage } from './stage/legislative-stage';
import {
  RadicalizationAction,
  RadicalizationStage,
} from './stage/radicalization-stage';
import { InterceptionStage } from './stage/interception-stage';
import { RoundStageIndex, StageQueue } from './stage/stage-queue';
import { LegislativeProposal } from 'src/domain/stage/legislative-proposal';
import { Law } from 'src/data/laws';
import { Voting } from 'src/domain/voting';

describe('Rodadas', () => {
  it('não deve finalizar rodada se ainda houver estágios a serem jogados', () => {
    const sabotageCardsDeck = makeSabotageCardsDeck();
    const lawsDeck = makeLawsDeck();
    const [error, game] = Game.create({
      players: Game.createPlayers([
        ['p1', 'p1'],
        ['p2', 'p2'],
        ['p3', 'p3'],
        ['p4', 'p4'],
        ['p5', 'p5'],
        ['p6', 'p6'],
        ['p7', 'p7'],
      ]),
      sabotageCardsDeck,
      lawsDeck,
    });
    expect(error).toBeUndefined();
    expect(game).toBeDefined();
    const [errorNextRound, round] = game!.nextRound();
    expect(round).toBeUndefined();
    expect(errorNextRound).toBe('A rodada atual não foi finalizada');
  });

  it('deve finalizar a rodada se todos os estágios foram jogados', () => {
    const players = Game.createPlayers([
      ['p1', 'p1'],
      ['p2', 'p2'],
      ['p3', 'p3'],
      ['p4', 'p4'],
      ['p5', 'p5'],
      ['p6', 'p6'],
      ['p7', 'p7'],
    ]);
    const sabotageCardsDeck = makeSabotageCardsDeck();
    const lawsDeck = makeLawsDeck();
    const presidentQueue = new PresidentQueue(
      Array.from(players.values()).map((p) => p.id),
    );
    const [error, game] = Game.create({
      players,
      sabotageCardsDeck,
      lawsDeck,
      presidentQueue,
      rounds: [
        new Round({
          presidentQueue,
          stageQueue: new StageQueue(RoundStageIndex.RADICALIZATION),
          stages: [new RadicalizationStage(RadicalizationAction.ADVANCE_STAGE)],
        }),
      ],
    });
    expect(error).toBeUndefined();
    expect(game).toBeDefined();
    const [errorNextRound] = game!.nextRound();
    expect(errorNextRound).toBeUndefined();
  });

  it('deve iniciar a próxima rodada com Relator', () => {
    const players = Game.createPlayers([
      ['p1', 'p1'],
      ['p2', 'p2'],
      ['p3', 'p3'],
      ['p4', 'p4'],
      ['p5', 'p5'],
      ['p6', 'p6'],
      ['p7', 'p7'],
    ]);
    const sabotageCardsDeck = makeSabotageCardsDeck();
    const lawsDeck = makeLawsDeck();
    const cpiStage = new CPIStage({
      proposals: [],
    });
    const [chooseNextRapporteurError] = cpiStage.chooseNextRapporteur({
      chosen: players.get('p3')!,
      currentPresident: players.get('p1')!.id,
      nextPresident: players.get('p2')!,
      currentRapporteur: null,
    });
    expect(chooseNextRapporteurError).toBeUndefined();
    const presidentQueue = new PresidentQueue(
      Array.from(players.values()).map((p) => p.id),
    );
    const [error, game] = Game.create({
      players,
      sabotageCardsDeck,
      lawsDeck,
      presidentQueue,
      rounds: [
        new Round({
          presidentQueue,
          stageQueue: new StageQueue(RoundStageIndex.CPI),
          stages: [cpiStage],
        }),
      ],
    });
    expect(error).toBeUndefined();
    expect(game).toBeDefined();
    expect(game?.currentRound.finished).toBe(true);
    const [errorNextRound] = game!.nextRound();
    expect(errorNextRound).toBeUndefined();
    expect(game!.currentRound.rapporteurId).toBe(players.get('p3')?.id);
  });
});

describe('Distribuição de Papéis', () => {
  it('deve distribuir jogadores aleatóriamente entre 1 radical, 4 moderados e 2 conservadores', () => {
    const sabotageCardsDeck = makeSabotageCardsDeck();
    const lawsDeck = makeLawsDeck();

    const [error, game] = Game.create({
      players: Game.createPlayers([
        ['p1', 'p1'],
        ['p2', 'p2'],
        ['p3', 'p3'],
        ['p4', 'p4'],
        ['p5', 'p5'],
        ['p6', 'p6'],
        ['p7', 'p7'],
      ]),
      sabotageCardsDeck,
      lawsDeck,
    });
    expect(error).toBeUndefined();
    expect(game).toBeDefined();
    expect(game!.players.filter((p) => p.role === Role.RADICAL).length).toBe(1);
    expect(game!.players.filter((p) => p.role === Role.MODERADO).length).toBe(
      4,
    );
    expect(
      game!.players.filter((p) => p.role === Role.CONSERVADOR).length,
    ).toBe(2);
  });

  it('deve definir um dos conservadores como sabotador', () => {
    const sabotageCardsDeck = makeSabotageCardsDeck();
    const lawsDeck = makeLawsDeck();

    const [error, game] = Game.create({
      players: Game.createPlayers([
        ['p1', 'p1'],
        ['p2', 'p2'],
        ['p3', 'p3'],
        ['p4', 'p4'],
        ['p5', 'p5'],
        ['p6', 'p6'],
        ['p7', 'p7'],
      ]),
      sabotageCardsDeck,
      lawsDeck,
    });
    expect(error).toBeUndefined();
    expect(game).toBeDefined();
    expect(game!.players.filter((p) => p.saboteur).length).toBe(1);
  });
});

describe('Crises', () => {
  it.each([2, 3, 4])(
    'deve iniciar rodada com crise por Receio ao moderado aprovar %dª lei progressita consecutiva',
    (n) => {
      const sabotageCardsDeck = makeSabotageCardsDeck();
      const lawsDeck = makeLawsDeck('progressive');
      const playersNames: [string, string][] = [
        ['p1', 'p1'],
        ['p2', 'p2'],
        ['p3', 'p3'],
        ['p4', 'p4'],
        ['p5', 'p5'],
        ['p6', 'p6'],
        ['p7', 'p7'],
      ];
      const players = Game.createPlayers(
        playersNames,
        Array.from(
          {
            length: 6,
          },
          () => Role.MODERADO,
        ),
      );

      const rounds = Array.from({ length: n }, (_, i) => {
        const legislativeStage = new LegislativeStage();
        const presidentQueue = new PresidentQueue(
          Array.from(players.values()).map((p) => p.id),
        );
        const president = presidentQueue.getByRoundNumber(i);
        legislativeStage.drawLaws(
          makeLawsDeck('progressive'),
          president,
          president,
        );
        legislativeStage.vetoLaw(0, president, president);
        legislativeStage.chooseLawForVoting(1, president, president);
        legislativeStage.startVoting(playersNames.map(([id]) => id));
        for (const player of players) {
          legislativeStage.vote(player[0], true);
        }
        legislativeStage.endVoting();
        return new Round({
          presidentQueue,
          stageQueue: new StageQueue(RoundStageIndex.RADICALIZATION),
          stages: [
            legislativeStage,
            new RadicalizationStage(RadicalizationAction.ADVANCE_STAGE),
          ],
        });
      });

      const [error, game] = Game.create({
        players,
        sabotageCardsDeck,
        lawsDeck,
        minProgressiveLawsToFearSabotage: n,
        rounds,
      });
      expect(error).toBeUndefined();
      expect(game).toBeDefined();
      const [errorNextRound] = game!.nextRound();
      expect(errorNextRound).toBeUndefined();
      expect(game!.currentRound.sabotageCard).not.toBeNull();
    },
  );

  it.each([2, 3, 4])(
    'não deve iniciar rodada com crise por Receio ao moderado aprovar %dª lei progressita consecutiva se moderado estiver radicalizado',
    (n) => {
      const sabotageCardsDeck = makeSabotageCardsDeck();
      const lawsDeck = makeLawsDeck('progressive');
      const playersNames: [string, string][] = [
        ['p1', 'p1'],
        ['p2', 'p2'],
        ['p3', 'p3'],
        ['p4', 'p4'],
        ['p5', 'p5'],
        ['p6', 'p6'],
        ['p7', 'p7'],
      ];
      const players = Game.createPlayers(
        playersNames,
        Array.from(
          {
            length: 6,
          },
          () => Role.MODERADO,
        ),
      );

      // for each player => player.radicalized = true
      players.forEach((player) => {
        player.radicalize();
        expect(player.radicalized).toBe(true);
      });

      const rounds = Array.from({ length: n }, (_, i) => {
        const legislativeStage = new LegislativeStage();
        const presidentQueue = new PresidentQueue(
          Array.from(players.values()).map((p) => p.id),
        );
        const president = presidentQueue.getByRoundNumber(i);
        legislativeStage.drawLaws(
          makeLawsDeck('progressive'),
          president,
          president,
        );
        legislativeStage.vetoLaw(0, president, president);
        legislativeStage.chooseLawForVoting(1, president, president);
        legislativeStage.startVoting(playersNames.map(([id]) => id));
        for (const player of players) {
          legislativeStage.vote(player[0], true);
        }
        return new Round({
          presidentQueue,
          stageQueue: new StageQueue(RoundStageIndex.RADICALIZATION),
          stages: [
            legislativeStage,
            new RadicalizationStage(RadicalizationAction.ADVANCE_STAGE),
          ],
        });
      });

      const [error, game] = Game.create({
        players,
        sabotageCardsDeck,
        lawsDeck,
        minProgressiveLawsToFearSabotage: n,
        rounds,
      });
      expect(error).toBeUndefined();
      expect(game).toBeDefined();
      const [errorNextRound] = game!.nextRound();
      expect(errorNextRound).toBeUndefined();
      expect(game!.currentRound.sabotageCard).toBeNull();
    },
  );

  it.each([2, 3, 4])(
    'deve iniciar rodada com crise a cada %d leis rejeitadas',
    (n: number) => {
      const sabotageCardsDeck = makeSabotageCardsDeck();
      const lawsDeck = makeLawsDeck('progressive');

      const rounds = Array.from({ length: n }, (_, i) => {
        const playersNames: [string, string][] = [
          ['p1', 'p1'],
          ['p2', 'p2'],
          ['p3', 'p3'],
          ['p4', 'p4'],
          ['p5', 'p5'],
          ['p6', 'p6'],
          ['p7', 'p7'],
        ];
        const players = Game.createPlayers(playersNames);
        const legislativeStage = new LegislativeStage();
        const presidentQueue = new PresidentQueue(
          Array.from(players.values()).map((p) => p.id),
        );
        const president = presidentQueue.getByRoundNumber(i);
        legislativeStage.drawLaws(makeLawsDeck(), president, president);
        legislativeStage.vetoLaw(0, president, president);
        legislativeStage.chooseLawForVoting(1, president, president);
        legislativeStage.startVoting(playersNames.map(([id]) => id));
        for (const player of players) {
          legislativeStage.vote(player[0], false);
        }
        legislativeStage.endVoting();

        return new Round({
          presidentQueue: new PresidentQueue(
            Array.from(players.values()).map((p) => p.id),
          ),
          stageQueue: new StageQueue(RoundStageIndex.RADICALIZATION),
          stages: [
            legislativeStage,
            new RadicalizationStage(RadicalizationAction.ADVANCE_STAGE),
          ],
        });
      });

      const [error, game] = Game.create({
        players: Game.createPlayers([
          ['p1', 'p1'],
          ['p2', 'p2'],
          ['p3', 'p3'],
          ['p4', 'p4'],
          ['p5', 'p5'],
          ['p6', 'p6'],
          ['p7', 'p7'],
        ]),
        sabotageCardsDeck,
        lawsDeck,
        rounds,
        rejectedLawsIntervalToSabotage: n,
      });
      expect(error).toBeUndefined();
      expect(game).toBeDefined();

      const [errorNextRound] = game!.nextRound();
      expect(errorNextRound).toBeUndefined();

      expect(game!.currentRound.sabotageCard).not.toBeNull();
    },
  );

  it('deve iniciar rodada com crise se ocorrer uma sabotagem', () => {
    const sabotageCardsDeck = makeSabotageCardsDeck();
    const lawsDeck = makeLawsDeck('progressive');
    const interceptionStage = new InterceptionStage();
    interceptionStage.interceptOrSkip(true);
    interceptionStage.drawSabotageCards(sabotageCardsDeck);
    interceptionStage.chooseSabotageCard(0);
    const players = Game.createPlayers([
      ['p1', 'p1'],
      ['p2', 'p2'],
      ['p3', 'p3'],
      ['p4', 'p4'],
      ['p5', 'p5'],
      ['p6', 'p6'],
      ['p7', 'p7'],
    ]);
    const rounds = [
      new Round({
        presidentQueue: new PresidentQueue(
          Array.from(players.values()).map((p) => p.id),
        ),
        stages: [interceptionStage],
        stageQueue: new StageQueue(RoundStageIndex.INTERCEPTION),
      }),
    ];

    const [error, game] = Game.create({
      players,
      sabotageCardsDeck,
      lawsDeck,
      rounds,
    });
    expect(error).toBeUndefined();
    expect(game).toBeDefined();
    const [errorNextRound] = game!.nextRound();
    expect(errorNextRound).toBeUndefined();
    expect(game!.currentRound.sabotageCard).not.toBeNull();
  });
});

describe('Cassações', () => {
  it.each([2, 3, 4])(
    'Deve iniciar o round com Impeachment a cada %d crises',
    (n) => {
      const sabotageCardsDeck = makeSabotageCardsDeck();
      const lawsDeck = makeLawsDeck('progressive');
      const playersNames: [string, string][] = [
        ['p1', 'p1'],
        ['p2', 'p2'],
        ['p3', 'p3'],
        ['p4', 'p4'],
        ['p5', 'p5'],
        ['p6', 'p6'],
        ['p7', 'p7'],
      ];
      const players = Game.createPlayers(playersNames);
      const rounds = Array.from({ length: n }, () => {
        return new Round({
          stages: [new RadicalizationStage(RadicalizationAction.ADVANCE_STAGE)],
          stageQueue: new StageQueue(RoundStageIndex.RADICALIZATION),
          sabotageCard: new SabotageCard(SABOTAGE_CARDS.PLANO_COHEN),
          presidentQueue: new PresidentQueue(
            Array.from(players.values()).map((p) => p.id),
          ),
        });
      });

      const [error, game] = Game.create({
        players,
        sabotageCardsDeck,
        lawsDeck,
        rounds,
        sabotagesIntervalToImpeach: n,
      });
      expect(error).toBeUndefined();
      expect(game).toBeDefined();

      const [errorNextRound] = game!.nextRound();
      expect(errorNextRound).toBeUndefined();

      expect(game!.currentRound.hasImpeachment).toBe(true);
    },
  );
});

describe('Presidência', () => {
  it('deve iniciar a primeira rodada com um jogador aleatório como presidente interino', () => {
    const sabotageCardsDeck = makeSabotageCardsDeck();
    const lawsDeck = makeLawsDeck();
    const [error, game] = Game.create({
      players: Game.createPlayers([
        ['p1', 'p1'],
        ['p2', 'p2'],
        ['p3', 'p3'],
        ['p4', 'p4'],
        ['p5', 'p5'],
        ['p6', 'p6'],
        ['p7', 'p7'],
      ]),
      sabotageCardsDeck,
      lawsDeck,
    });
    expect(error).toBeUndefined();
    expect(game).toBeDefined();
    expect(game?.currentRoundIndex).toBe(0);
    expect(game!.presidentId).toBeDefined();
  });

  it('deve iniciar a próxima rodada com o próximo jogador como presidente interino', () => {
    const players = Game.createPlayers([
      ['p1', 'p1'],
      ['p2', 'p2'],
      ['p3', 'p3'],
      ['p4', 'p4'],
      ['p5', 'p5'],
      ['p6', 'p6'],
      ['p7', 'p7'],
    ]);
    const sabotageCardsDeck = makeSabotageCardsDeck();
    const lawsDeck = makeLawsDeck();
    const presidentQueue = new PresidentQueue(
      Array.from(players.values()).map((p) => p.id),
    );
    const [error, game] = Game.create({
      players,
      sabotageCardsDeck,
      lawsDeck,
      presidentQueue,
      rounds: [
        new Round({
          presidentQueue,
          stages: [new RadicalizationStage(RadicalizationAction.ADVANCE_STAGE)],
          stageQueue: new StageQueue(RoundStageIndex.RADICALIZATION),
        }),
      ],
    });
    expect(error).toBeUndefined();
    expect(game).toBeDefined();
    const firstPresident = game!.presidentId;
    const [nextRoundError] = game!.nextRound();
    expect(nextRoundError).toBeUndefined();
    expect(game!.currentRoundIndex).toBe(1);
    expect(game!.presidentId).toBeDefined();
    expect(game!.presidentId).not.toBe(firstPresident);
  });

  it('deve pular jogador cassado na fila de presidente', () => {
    const playersNames: [string, string][] = [
      ['p1', 'p1'],
      ['p2', 'p2'],
      ['p3', 'p3'],
      ['p4', 'p4'],
      ['p5', 'p5'],
      ['p6', 'p6'],
      ['p7', 'p7'],
    ];
    const players = Game.createPlayers(playersNames);
    players.get('p1')!.impeached = true;
    const sabotageCardsDeck = makeSabotageCardsDeck();
    const lawsDeck = makeLawsDeck();
    const presidentQueue = new PresidentQueue(
      Array.from(players.values()).map((p) => p.id),
    );
    const [error, game] = Game.create({
      players,
      sabotageCardsDeck,
      lawsDeck,
      presidentQueue,
      rounds: [
        new Round({
          hasImpeachment: true,
          presidentQueue,
          stages: [new RadicalizationStage(RadicalizationAction.ADVANCE_STAGE)],
          stageQueue: new StageQueue(RoundStageIndex.RADICALIZATION),
        }),
      ],
    });
    expect(error).toBeUndefined();
    expect(game).toBeDefined();
    const [errorNextRound] = game!.nextRound();
    expect(errorNextRound).toBeUndefined();
    expect(game!.presidentId).toBe('p2');
  });

  it('não deve permitir jogador cassado como relator do dossiê', () => {
    const playersNames: [string, string][] = [
      ['p1', 'p1'],
      ['p2', 'p2'],
      ['p3', 'p3'],
      ['p4', 'p4'],
      ['p5', 'p5'],
      ['p6', 'p6'],
      ['p7', 'p7'],
    ];
    const players = Game.createPlayers(playersNames);
    const sabotageCardsDeck = makeSabotageCardsDeck();
    const lawsDeck = makeLawsDeck();
    const [error, game] = Game.create({
      players,
      sabotageCardsDeck,
      lawsDeck,
      rounds: [
        new Round({
          presidentQueue: new PresidentQueue(
            Array.from(players.values()).map((p) => p.id),
          ),
          hasImpeachment: true,
        }),
      ],
    });
    expect(error).toBeUndefined();
    expect(game).toBeDefined();
    expect(game?.currentRound.currentStage.type).toBe(StageType.IMPEACHMENT);
    const stage = game!.currentRound.currentStage as ImpeachmentStage;
    const target = game!.players.find((p) => p.id !== game?.presidentId);
    const [chooseTargetError] = stage.chooseTarget(target!.id, target!.role);
    expect(chooseTargetError).toBeUndefined();
    const [startVotingError, voting] = stage.startVoting(
      playersNames.map(([id]) => id),
    );
    expect(startVotingError).toBeUndefined();
    expect(voting).toBeDefined();
    for (const [player] of playersNames) {
      const [error] = stage.vote(player, true, target!);
      expect(error).toBeUndefined();
    }
    expect(stage.voting?.votes.get('p1')).toBe(true);
    expect(stage.isComplete).toBe(true);
    expect(target?.impeached).toBe(true);
  });
});

describe('Condições de Vitória', () => {
  it.each([6, 7, 8])(
    'deve declarar moderados vencedores se aprovar %d leis progressistas',
    (n) => {
      const playersNames: [string, string][] = [
        ['p1', 'p1'],
        ['p2', 'p2'],
        ['p3', 'p3'],
        ['p4', 'p4'],
        ['p5', 'p5'],
        ['p6', 'p6'],
        ['p7', 'p7'],
      ];
      const players = Game.createPlayers(playersNames);
      const lawsDeck = makeLawsDeck('progressive');
      const sabotageCardsDeck = makeSabotageCardsDeck();
      const presidentQueue = new PresidentQueue(
        Array.from(players.values()).map((p) => p.id),
      );
      const rounds = Array.from(
        {
          length: n,
        },
        (_, i) => {
          const legislativeStage = new LegislativeStage();
          const president = presidentQueue.getByRoundNumber(i);
          legislativeStage.drawLaws(lawsDeck, president, president);
          legislativeStage.vetoLaw(0, president, president);
          legislativeStage.chooseLawForVoting(1, president, president);
          legislativeStage.startVoting(playersNames.map(([id]) => id));
          for (const player of players) {
            legislativeStage.vote(player[0], true);
          }
          legislativeStage.endVoting();
          return new Round({
            index: i,
            presidentQueue,
            stages: [legislativeStage],
          });
        },
      );
      const [error, game] = Game.create({
        sabotageCardsDeck,
        lawsDeck,
        players,
        presidentQueue,
        lawsToProgressiveWin: n,
        rounds,
      });
      expect(error).toBeUndefined();
      expect(game).toBeDefined();
      expect(game?.approvedLaws).toHaveLength(n);
      expect(game!.winner).toBe(Role.MODERADO);
    },
  );

  it.each([6, 7, 8])(
    'deve declarar conservador vencedor se aprovar %d leis conservadoras',
    (n) => {
      const playersNames: [string, string][] = [
        ['p1', 'p1'],
        ['p2', 'p2'],
        ['p3', 'p3'],
        ['p4', 'p4'],
        ['p5', 'p5'],
        ['p6', 'p6'],
        ['p7', 'p7'],
      ];
      const players = Game.createPlayers(playersNames);
      const lawsDeck = makeLawsDeck('conservative');
      const sabotageCardsDeck = makeSabotageCardsDeck();
      const presidentQueue = new PresidentQueue(
        Array.from(players.values()).map((p) => p.id),
      );
      const rounds = Array.from(
        {
          length: n,
        },
        (_, i) => {
          const legislativeStage = new LegislativeStage();
          const president = presidentQueue.getByRoundNumber(i);
          legislativeStage.drawLaws(makeLawsDeck(), president, president);
          legislativeStage.vetoLaw(0, president, president);
          legislativeStage.chooseLawForVoting(1, president, president);
          legislativeStage.startVoting(playersNames.map(([id]) => id));
          for (const player of players) {
            legislativeStage.vote(player[0], true);
          }
          legislativeStage.endVoting();
          return new Round({
            presidentQueue,
            index: i,
            stages: [legislativeStage],
          });
        },
      );
      const [error, game] = Game.create({
        sabotageCardsDeck,
        lawsDeck,
        players,
        lawsToConservativeWin: n,
        presidentQueue,
        rounds,
      });
      expect(error).toBeUndefined();
      expect(game).toBeDefined();
      expect(game?.approvedLaws).toHaveLength(n);
      expect(game!.winner).toBe(Role.CONSERVADOR);
    },
  );

  it('deve declarar conservador vencedor se cassar radical', () => {
    const playersNames: [string, string][] = [
      ['p1', 'p1'],
      ['p2', 'p2'],
      ['p3', 'p3'],
      ['p4', 'p4'],
      ['p5', 'p5'],
      ['p6', 'p6'],
      ['p7', 'p7'],
    ];
    const players = Game.createPlayers(playersNames);
    const lawsDeck = makeLawsDeck('conservative');
    const sabotageCardsDeck = makeSabotageCardsDeck();
    const radical = Array.from(players.values()).find(
      (p) => p.role === Role.RADICAL,
    )!;
    const accuser = Array.from(players.values()).find((p) => p !== radical)!;
    const impeachmentStage = new ImpeachmentStage(accuser.id);
    impeachmentStage.chooseTarget(radical.id, Role.RADICAL);
    impeachmentStage.startVoting(playersNames.map(([id]) => id));
    for (const player of players) {
      impeachmentStage.vote(player[0], true, radical);
    }
    const presidentQueue = new PresidentQueue(
      Array.from(players.values()).map((p) => p.id),
    );
    const rounds = [
      new Round({
        presidentQueue,
        stages: [impeachmentStage],
      }),
    ];
    const [error, game] = Game.create({
      sabotageCardsDeck,
      lawsDeck,
      players,
      presidentQueue,
      rounds,
    });
    expect(error).toBeUndefined();
    expect(game).toBeDefined();
    expect(game!.winner).toBe(Role.CONSERVADOR);
  });

  it('deve declarar radical vencedor se cassar 2 conservadores', () => {
    const playersNames: [string, string][] = [
      ['p1', 'p1'],
      ['p2', 'p2'],
      ['p3', 'p3'],
      ['p4', 'p4'],
      ['p5', 'p5'],
      ['p6', 'p6'],
      ['p7', 'p7'],
    ];
    const players = Game.createPlayers(playersNames);
    const lawsDeck = makeLawsDeck('conservative');
    const sabotageCardsDeck = makeSabotageCardsDeck();
    const conservatives = Array.from(players.values()).filter(
      (p) => p.role === Role.CONSERVADOR,
    );
    const accuser = Array.from(players.values()).find(
      (p) => p.role !== Role.CONSERVADOR,
    )!;
    const presidentQueue = new PresidentQueue(
      Array.from(players.values()).map((p) => p.id),
    );

    const stages = conservatives.map((target) => {
      const impeachmentStage = new ImpeachmentStage(accuser.id);
      impeachmentStage.chooseTarget(target.id, target.role);
      impeachmentStage.startVoting(playersNames.map(([id]) => id));
      for (const player of players) {
        impeachmentStage.vote(player[0], true, target);
      }
      return impeachmentStage;
    });

    const rounds = [
      new Round({
        presidentQueue,
        stages,
      }),
    ];
    const [error, game] = Game.create({
      sabotageCardsDeck,
      lawsDeck,
      players,
      conservativesImpeachedToRadicalWin: 2,
      presidentQueue,
      rounds,
    });
    expect(error).toBeUndefined();
    expect(game).toBeDefined();
    expect(game!.winner).toBe(Role.RADICAL);
  });

  it('deve desconsiderar leis aprovadas, que na rodada seguinte foram desabilitadas', () => {
    const playersNames: [string, string][] = [
      ['p1', 'p1'],
      ['p2', 'p2'],
      ['p3', 'p3'],
      ['p4', 'p4'],
      ['p5', 'p5'],
      ['p6', 'p6'],
      ['p7', 'p7'],
    ];
    const players = Game.createPlayers(playersNames);
    const lawsDeck = makeLawsDeck('progressive');
    const sabotageCardsDeck = makeSabotageCardsDeck();
    const presidentQueue = new PresidentQueue(
      Array.from(players.values()).map((p) => p.id),
    );
    const round1 = new Round({
      presidentQueue,
      stages: [
        new LegislativeStage({
          currentAction: LegislativeAction.ADVANCE_STAGE,
          proposals: [
            new LegislativeProposal(
              new Law('1', LawType.PROGRESSISTAS, '1'),
              false,
              true,
            ),
          ],
          voting: Voting.fromJSON({
            hasEnded: true,
            votes: Array.from(players.values()).map((p) => ({
              player: p.id,
              vote: true,
            })),
          }),
        }),
      ],
    });
    const round2 = new Round({
      presidentQueue,
      disablePreviousLaw: LawType.PROGRESSISTAS,
    });

    const [error, game] = Game.create({
      sabotageCardsDeck,
      lawsDeck,
      players,
      presidentQueue,
      lawsToProgressiveWin: 2,
      rounds: [round1, round2],
    });
    expect(error).toBeUndefined();
    expect(game).toBeDefined();
    expect(game?.approvedLaws).toHaveLength(0);
  });
});
