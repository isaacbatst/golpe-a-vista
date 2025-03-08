import CRISES from 'src/data/crises';
import { Crisis } from 'src/domain/crisis/crisis';
import { StageType } from 'src/domain/stage/stage';
import { describe, expect, it } from 'vitest';
import { Game } from './game';
import { makeCrisesDeck, makeLawsDeck } from './mock';
import { PresidentQueue } from './president-queue';
import { Role } from './role';
import { Round } from './round';
import { DossierStage } from './stage/dossier-stage';
import { ImpeachmentStage } from './stage/impeachment-stage';
import { LegislativeStage } from './stage/legislative-stage';
import {
  RadicalizationAction,
  RadicalizationStage,
} from './stage/radicalization-stage';
import { SabotageStage } from './stage/sabotage-stage';
import { RoundStageIndex, StageQueue } from './stage/stage-queue';

describe('Rodadas', () => {
  it('não deve finalizar rodada se ainda houver estágios a serem jogados', () => {
    const crisesDeck = makeCrisesDeck();
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
      crisesDeck,
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
    const crisesDeck = makeCrisesDeck();
    const lawsDeck = makeLawsDeck();
    const presidentQueue = new PresidentQueue(
      Array.from(players.values()).map((p) => p.id),
    );
    const [error, game] = Game.create({
      players,
      crisesDeck,
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
    const crisesDeck = makeCrisesDeck();
    const lawsDeck = makeLawsDeck();
    const dossierStage = new DossierStage({
      proposals: [],
    });
    const [chooseNextRapporteurError] = dossierStage.chooseNextRapporteur({
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
      crisesDeck,
      lawsDeck,
      presidentQueue,
      rounds: [
        new Round({
          presidentQueue,
          stageQueue: new StageQueue(RoundStageIndex.DOSSIER),
          stages: [dossierStage],
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
    const crisesDeck = makeCrisesDeck();
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
      crisesDeck,
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
    const crisesDeck = makeCrisesDeck();
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
      crisesDeck,
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
      const crisesDeck = makeCrisesDeck();
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
        crisesDeck,
        lawsDeck,
        minProgressiveLawsToFearCrisis: n,
        rounds,
      });
      expect(error).toBeUndefined();
      expect(game).toBeDefined();
      const [errorNextRound] = game!.nextRound();
      expect(errorNextRound).toBeUndefined();
      expect(game!.currentRound.crisis).not.toBeNull();
    },
  );

  it.each([2, 3, 4])(
    'não deve iniciar rodada com crise por Receio ao moderado aprovar %dª lei progressita consecutiva se moderado estiver radicalizado',
    (n) => {
      const crisesDeck = makeCrisesDeck();
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
        crisesDeck,
        lawsDeck,
        minProgressiveLawsToFearCrisis: n,
        rounds,
      });
      expect(error).toBeUndefined();
      expect(game).toBeDefined();
      const [errorNextRound] = game!.nextRound();
      expect(errorNextRound).toBeUndefined();
      expect(game!.currentRound.crisis).toBeNull();
    },
  );

  it.each([2, 3, 4])(
    'deve iniciar rodada com crise a cada %d leis rejeitadas',
    (n: number) => {
      const crisesDeck = makeCrisesDeck();
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
        crisesDeck,
        lawsDeck,
        rounds,
        rejectedLawsIntervalToCrisis: n,
      });
      expect(error).toBeUndefined();
      expect(game).toBeDefined();

      const [errorNextRound] = game!.nextRound();
      expect(errorNextRound).toBeUndefined();

      expect(game!.currentRound.crisis).not.toBeNull();
    },
  );

  it('deve iniciar rodada com crise se ocorrer uma sabotagem', () => {
    const crisesDeck = makeCrisesDeck();
    const lawsDeck = makeLawsDeck('progressive');
    const sabotageStage = new SabotageStage();
    sabotageStage.sabotageOrSkip(true);
    sabotageStage.drawCrises(crisesDeck);
    sabotageStage.chooseSabotageCrisis(0);
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
        stages: [sabotageStage],
        stageQueue: new StageQueue(RoundStageIndex.SABOTAGE),
      }),
    ];

    const [error, game] = Game.create({
      players,
      crisesDeck,
      lawsDeck,
      rounds,
    });
    expect(error).toBeUndefined();
    expect(game).toBeDefined();
    const [errorNextRound] = game!.nextRound();
    expect(errorNextRound).toBeUndefined();
    expect(game!.currentRound.crisis).not.toBeNull();
  });
});

describe('Cassações', () => {
  it.each([2, 3, 4])(
    'Deve iniciar o round com Impeachment a cada %d crises',
    (n) => {
      const crisesDeck = makeCrisesDeck();
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
          crisis: new Crisis(CRISES.PLANO_COHEN),
          presidentQueue: new PresidentQueue(
            Array.from(players.values()).map((p) => p.id),
          ),
        });
      });

      const [error, game] = Game.create({
        players,
        crisesDeck,
        lawsDeck,
        rounds,
        crisesIntervalToImpeach: n,
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
    const crisesDeck = makeCrisesDeck();
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
      crisesDeck,
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
    const crisesDeck = makeCrisesDeck();
    const lawsDeck = makeLawsDeck();
    const presidentQueue = new PresidentQueue(
      Array.from(players.values()).map((p) => p.id),
    );
    const [error, game] = Game.create({
      players,
      crisesDeck,
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
    const crisesDeck = makeCrisesDeck();
    const lawsDeck = makeLawsDeck();
    const presidentQueue = new PresidentQueue(
      Array.from(players.values()).map((p) => p.id),
    );
    const [error, game] = Game.create({
      players,
      crisesDeck,
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
    const crisesDeck = makeCrisesDeck();
    const lawsDeck = makeLawsDeck();
    const [error, game] = Game.create({
      players,
      crisesDeck,
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
    console.log('votes', stage.voting);
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
      const crisesDeck = makeCrisesDeck();
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
        crisesDeck,
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
      const crisesDeck = makeCrisesDeck();
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
        crisesDeck,
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
    const crisesDeck = makeCrisesDeck();
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
      crisesDeck,
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
    const crisesDeck = makeCrisesDeck();
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
      crisesDeck,
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
});
