import { describe, expect, it } from 'vitest';
import { PlanoCohen } from './crisis/plano-cohen';
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
    const [errorNextRound] = game!.nextRound();
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
    const presidentQueue = new PresidentQueue(Array.from(players.values()));
    const [error, game] = Game.create({
      players,
      crisesDeck,
      lawsDeck,
      presidentQueue,
      rounds: [
        new Round({
          crisesDeck,
          lawsDeck,
          presidentQueue,
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
      currentPresident: players.get('p1')!,
      nextPresident: players.get('p2')!,
      currentRapporteur: null,
      lawsDeck,
      drawnLaws: [],
    });
    dossierStage.chooseNextRapporteur(players.get('p3')!);
    dossierStage.passDossier();
    const presidentQueue = new PresidentQueue(Array.from(players.values()));
    const [error, game] = Game.create({
      players,
      crisesDeck,
      lawsDeck,
      presidentQueue,
      rounds: [
        new Round({
          crisesDeck,
          lawsDeck,
          presidentQueue,
          stages: [dossierStage],
        }),
      ],
    });
    expect(error).toBeUndefined();
    expect(game).toBeDefined();

    const [errorNextRound] = game!.nextRound();
    expect(errorNextRound).toBeUndefined();
    expect(game!.currentRound.rapporteur).toBe(players.get('p3')!);
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
});

describe('Crises', () => {
  it.each([2, 3, 4])(
    'deve iniciar rodada com crise se moderado aprovar %dª lei progressita consecutiva',
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

      const rounds = Array.from({ length: n }, () => {
        const legislativeStage = new LegislativeStage({ lawsDeck });
        legislativeStage.drawLaws();
        legislativeStage.vetoLaw(0);
        legislativeStage.chooseLawForVoting(1);
        legislativeStage.startVoting(playersNames.map(([id]) => id));
        for (const player of players) {
          legislativeStage.vote(player[0], true);
        }
        return new Round({
          crisesDeck,
          lawsDeck,
          presidentQueue: new PresidentQueue(Array.from(players.values())),
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
    'deve iniciar rodada com crise a cada %d leis rejeitadas',
    (n: number) => {
      const crisesDeck = makeCrisesDeck();
      const lawsDeck = makeLawsDeck('progressive');

      const rounds = Array.from({ length: n }, () => {
        const legislativeStage = new LegislativeStage({ lawsDeck });
        legislativeStage.drawLaws();
        legislativeStage.vetoLaw(0);
        legislativeStage.chooseLawForVoting(1);
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
        legislativeStage.startVoting(playersNames.map(([id]) => id));
        for (const player of players) {
          legislativeStage.vote(player[0], false);
        }

        return new Round({
          crisesDeck,
          lawsDeck,
          presidentQueue: new PresidentQueue(Array.from(players.values())),
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
    const sabotageStage = new SabotageStage(crisesDeck);
    sabotageStage.drawCrises();
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
        crisesDeck,
        lawsDeck,
        presidentQueue: new PresidentQueue(Array.from(players.values())),
        stages: [sabotageStage],
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
    'Deve iniciar o round com Cassação a cada %d crises',
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
          crisesDeck,
          lawsDeck,
          stages: [new RadicalizationStage(RadicalizationAction.ADVANCE_STAGE)],
          crisis: new PlanoCohen(),
          presidentQueue: new PresidentQueue(Array.from(players.values())),
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
    expect(game!.president).toBeDefined();
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
    const presidentQueue = new PresidentQueue(Array.from(players.values()));
    const [error, game] = Game.create({
      players,
      crisesDeck,
      lawsDeck,
      presidentQueue,
      rounds: [
        new Round({
          crisesDeck,
          lawsDeck,
          presidentQueue,
          stages: [new RadicalizationStage(RadicalizationAction.ADVANCE_STAGE)],
        }),
      ],
    });
    expect(error).toBeUndefined();
    expect(game).toBeDefined();
    const firstPresident = game!.president;
    const [nextRoundError] = game!.nextRound();
    expect(nextRoundError).toBeUndefined();
    expect(game!.currentRoundIndex).toBe(1);
    expect(game!.president).toBeDefined();
    expect(game!.president).not.toBe(firstPresident);
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
    const presidentQueue = new PresidentQueue(Array.from(players.values()));
    const [error, game] = Game.create({
      players,
      crisesDeck,
      lawsDeck,
      presidentQueue,
      rounds: [
        new Round({
          crisesDeck,
          lawsDeck,
          hasImpeachment: true,
          presidentQueue,
          stages: [new RadicalizationStage(RadicalizationAction.ADVANCE_STAGE)],
        }),
      ],
    });
    expect(error).toBeUndefined();
    expect(game).toBeDefined();
    const [errorNextRound] = game!.nextRound();
    expect(errorNextRound).toBeUndefined();
    expect(game!.president).toBe(players.get('p2')!);
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
          crisesDeck,
          lawsDeck,
          presidentQueue: new PresidentQueue(Array.from(players.values())),
          hasImpeachment: true,
        }),
      ],
    });
    expect(error).toBeUndefined();
    expect(game).toBeDefined();
    expect(game?.currentRound.currentStage).toBeInstanceOf(ImpeachmentStage);
    const stage = game!.currentRound.currentStage as ImpeachmentStage;
    const target = game!.players.find((p) => p !== game?.president);
    stage.chooseTarget(target!);
    stage.startVoting(playersNames.map(([id]) => id));
    for (const player of players) {
      stage.vote(player[0], true);
    }
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
      const presidentQueue = new PresidentQueue(Array.from(players.values()));
      const rounds = Array.from(
        {
          length: n,
        },
        (_, i) => {
          const legislativeStage = new LegislativeStage({ lawsDeck });
          legislativeStage.drawLaws();
          legislativeStage.vetoLaw(0);
          legislativeStage.chooseLawForVoting(1);
          legislativeStage.startVoting(playersNames.map(([id]) => id));
          for (const player of players) {
            legislativeStage.vote(player[0], true);
          }
          return new Round({
            crisesDeck,
            lawsDeck,
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
      const presidentQueue = new PresidentQueue(Array.from(players.values()));
      const rounds = Array.from(
        {
          length: n,
        },
        (_, i) => {
          const legislativeStage = new LegislativeStage({ lawsDeck });
          legislativeStage.drawLaws();
          legislativeStage.vetoLaw(0);
          legislativeStage.chooseLawForVoting(1);
          legislativeStage.startVoting(playersNames.map(([id]) => id));
          for (const player of players) {
            legislativeStage.vote(player[0], true);
          }
          return new Round({
            crisesDeck,
            lawsDeck,
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
    const impeachmentStage = new ImpeachmentStage(accuser);
    impeachmentStage.chooseTarget(radical);
    impeachmentStage.startVoting(playersNames.map(([id]) => id));
    for (const player of players) {
      impeachmentStage.vote(player[0], true);
    }
    const presidentQueue = new PresidentQueue(Array.from(players.values()));
    const rounds = [
      new Round({
        crisesDeck,
        lawsDeck,
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
    const presidentQueue = new PresidentQueue(Array.from(players.values()));

    const stages = conservatives.map((target) => {
      const impeachmentStage = new ImpeachmentStage(accuser);
      impeachmentStage.chooseTarget(target);
      impeachmentStage.startVoting(playersNames.map(([id]) => id));
      for (const player of players) {
        impeachmentStage.vote(player[0], true);
      }
      return impeachmentStage;
    });

    const rounds = [
      new Round({
        crisesDeck,
        lawsDeck,
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
