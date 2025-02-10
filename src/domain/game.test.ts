import { describe, expect, it } from "vitest";
import { makeCrisesDeck, makeLawsDeck } from "./deck-factory";
import { Game } from "./game";
import { Role } from "./role";
import { Round } from "./round";
import { ImpeachmentStage } from "./stage/impeachment-stage";
import { LegislativeStage } from "./stage/legislative-stage";
import {
  RadicalizationAction,
  RadicalizationStage,
} from "./stage/radicalization-stage";
import { SabotageStage } from "./stage/sabotage-stage";
import { Crisis, CrisisVisibleTo } from "./crisis";

describe("Rodadas", () => {
  it("não deve finalizar rodada se ainda houver estágios a serem jogados", () => {
    const crisesDeck = makeCrisesDeck();
    const lawsDeck = makeLawsDeck();
    const [error, game] = Game.create({
      players: Game.createPlayers(["p1", "p2", "p3", "p4", "p5", "p6"]),
      crisesDeck,
      lawsDeck,
    });
    expect(error).toBeUndefined();
    expect(game).toBeDefined();
    const [errorNextRound] = game!.nextRound();
    expect(errorNextRound).toBe("A rodada atual não foi finalizada");
  });

  it("deve finalizar a rodada se todos os estágios foram jogados", () => {
    const players = Game.createPlayers(["p1", "p2", "p3", "p4", "p5", "p6"]);
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
          president: players[0],
          nextPresident: players[1],
          stages: [new RadicalizationStage(RadicalizationAction.ADVANCE_STAGE)],
        }),
      ],
    });
    expect(error).toBeUndefined();
    expect(game).toBeDefined();
    const [errorNextRound] = game!.nextRound();
    expect(errorNextRound).toBeUndefined();
  });
});

describe("Distribuição de Papéis", () => {
  it("deve distribuir jogadores aleatóriamente entre 1 radical, 3 moderados e 2 conservadores", () => {
    const crisesDeck = makeCrisesDeck();
    const lawsDeck = makeLawsDeck();

    const [error, game] = Game.create({
      players: Game.createPlayers(["p1", "p2", "p3", "p4", "p5", "p6"]),
      crisesDeck,
      lawsDeck,
    });
    expect(error).toBeUndefined();
    expect(game).toBeDefined();
    expect(game!.players.filter((p) => p.role === Role.RADICAL).length).toBe(1);
    expect(game!.players.filter((p) => p.role === Role.MODERADO).length).toBe(
      3
    );
    expect(
      game!.players.filter((p) => p.role === Role.CONSERVADOR).length
    ).toBe(2);
  });
});

describe("Crises", () => {
  it.each([2, 3, 4])(
    "deve iniciar rodada com crise se moderado aprovar %dª lei progressita consecutiva",
    (n) => {
      const crisesDeck = makeCrisesDeck();
      const lawsDeck = makeLawsDeck("progressive");
      const playersNames = ["p1", "p2", "p3", "p4", "p5", "p6"];
      const players = Game.createPlayers(
        playersNames,
        Array.from(
          {
            length: 6,
          },
          () => Role.MODERADO
        )
      );

      const rounds = Array.from({ length: n }, () => {
        const legislativeStage = new LegislativeStage(lawsDeck);
        legislativeStage.drawLaws();
        legislativeStage.vetoLaw(0);
        legislativeStage.chooseLawForVoting(1);
        legislativeStage.startVoting(playersNames);
        for (const player of players) {
          legislativeStage.vote(player.name, true);
        }
        return new Round({
          crisesDeck,
          lawsDeck,
          president: players[0],
          nextPresident: players[1],
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
      expect(game!.currentRound!.crisis).not.toBeNull();
    }
  );

  it.each([2, 3, 4])(
    "deve iniciar rodada com crise a cada %d leis rejeitadas",
    (n: number) => {
      const crisesDeck = makeCrisesDeck();
      const lawsDeck = makeLawsDeck("progressive");

      const rounds = Array.from({ length: n }, () => {
        const legislativeStage = new LegislativeStage(lawsDeck);
        legislativeStage.drawLaws();
        legislativeStage.vetoLaw(0);
        legislativeStage.chooseLawForVoting(1);
        const playersNames = ["p1", "p2", "p3", "p4", "p5", "p6"];
        const players = Game.createPlayers(playersNames);
        legislativeStage.startVoting(playersNames);
        for (const player of players) {
          legislativeStage.vote(player.name, false);
        }

        return new Round({
          crisesDeck,
          lawsDeck,
          president: players[0],
          nextPresident: players[1],
          stages: [
            legislativeStage,
            new RadicalizationStage(RadicalizationAction.ADVANCE_STAGE),
          ],
        });
      });

      const [error, game] = Game.create({
        players: Game.createPlayers(["p1", "p2", "p3", "p4", "p5", "p6"]),
        crisesDeck,
        lawsDeck,
        rounds,
        rejectedLawsIntervalToCrisis: n,
      });
      expect(error).toBeUndefined();
      expect(game).toBeDefined();

      const [errorNextRound] = game!.nextRound();
      expect(errorNextRound).toBeUndefined();

      expect(game!.currentRound!.crisis).not.toBeNull();
    }
  );

  it("deve iniciar rodada com crise se ocorrer uma sabotagem", () => {
    const crisesDeck = makeCrisesDeck();
    const lawsDeck = makeLawsDeck("progressive");
    const sabotageStage = new SabotageStage(crisesDeck);
    sabotageStage.drawCrises();
    sabotageStage.chooseSabotageCrisis(0);
    const players = Game.createPlayers(["p1", "p2", "p3", "p4", "p5", "p6"]);
    const rounds = [
      new Round({
        crisesDeck,
        lawsDeck,
        president: players[0],
        nextPresident: players[1],
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
    expect(game!.currentRound!.crisis).not.toBeNull();
  });
});

describe("Cassações", () => {
  it.each([2,3,4,])("Deve iniciar o round com Cassação a cada %d crises", (n) => {
    const crisesDeck = makeCrisesDeck();
    const lawsDeck = makeLawsDeck("progressive");
    const playersNames = ["p1", "p2", "p3", "p4", "p5", "p6"];
    const players = Game.createPlayers(playersNames);
    const rounds = Array.from({ length: n }, () => {
      return new Round({
        crisesDeck,
        lawsDeck,
        stages: [new RadicalizationStage(RadicalizationAction.ADVANCE_STAGE)],
        crisis: new Crisis(["Título"], "descrição", [CrisisVisibleTo.PRESIDENT]),
        president: players[0],
        nextPresident: players[1],
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

    expect(game!.currentRound!.hasImpeachment).toBe(true);
  });
});

describe("Presidência", () => {
  it("deve iniciar a primeira rodada com um jogador aleatório como presidente interino", () => {
    const crisesDeck = makeCrisesDeck();
    const lawsDeck = makeLawsDeck();
    const [error, game] = Game.create({
      players: Game.createPlayers(["p1", "p2", "p3", "p4", "p5", "p6"]),
      crisesDeck,
      lawsDeck,
    });
    expect(error).toBeUndefined();
    expect(game).toBeDefined();
    expect(game?.currentRoundIndex).toBe(0);
    expect(game!.president).toBeDefined();
  });

  it("deve iniciar a próxima rodada com o próximo jogador como presidente interino", () => {
    const players = Game.createPlayers(["p1", "p2", "p3", "p4", "p5", "p6"]);
    const crisesDeck = makeCrisesDeck();
    const lawsDeck = makeLawsDeck();
    const [error, game] = Game.create({
      players,
      crisesDeck,
      lawsDeck,
      presidentQueue: [...players],
      rounds: [
        new Round({
          crisesDeck,
          lawsDeck,
          president: players[0],
          nextPresident: players[1],
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
  it("deve pular jogador cassado na fila de presidente", () => {
    const playersNames = ["p1", "p2", "p3", "p4", "p5", "p6"];
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
          president: players[0],
          nextPresident: players[1],
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
    stage.startVoting(playersNames);
    for (const player of players) {
      stage.vote(player.name, true);
    }
    expect(target?.impeached).toBe(true);

    for (let i = 0; i < players.length; i++) {
      expect(game?.getPresidentFromQueue(i)).not.toBe(target);
    }
  });

  it("não deve permitir jogador cassado como relator do dossiê", () => {
    const playersNames = ["p1", "p2", "p3", "p4", "p5", "p6"];
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
          president: players[0],
          nextPresident: players[1],
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
    stage.startVoting(playersNames);
    for (const player of players) {
      stage.vote(player.name, true);
    }
    expect(target?.impeached).toBe(true);
  });
});

describe("Condições de Vitória", () => {
  it.each([6, 7, 8])(
    "deve declarar moderados vencedores se aprovar %d leis progressistas",
    (n) => {
      const playersNames = ["p1", "p2", "p3", "p4", "p5", "p6"];
      const players = Game.createPlayers(playersNames);
      const lawsDeck = makeLawsDeck("progressive");
      const crisesDeck = makeCrisesDeck();
      const rounds = Array.from(
        {
          length: n,
        },
        (_, i) => {
          const legislativeStage = new LegislativeStage(lawsDeck);
          legislativeStage.drawLaws();
          legislativeStage.vetoLaw(0);
          legislativeStage.chooseLawForVoting(1);
          legislativeStage.startVoting(playersNames);
          for (const player of players) {
            legislativeStage.vote(player.name, true);
          }
          return new Round({
            crisesDeck,
            lawsDeck,
            president: players[i % players.length],
            nextPresident: players[i + (1 % players.length)],
            stages: [legislativeStage],
          });
        }
      );
      const [error, game] = Game.create({
        crisesDeck,
        lawsDeck,
        players,
        lawsToProgressiveWin: n,
        presidentQueue: [...players],
        rounds,
      });
      expect(error).toBeUndefined();
      expect(game).toBeDefined();
      expect(game?.approvedLaws).toHaveLength(n);
      expect(game!.winner).toBe(Role.MODERADO);
    }
  );

  it.each([6, 7, 8])(
    "deve declarar conservador vencedor se aprovar %d leis conservadoras",
    (n) => {
      const playersNames = ["p1", "p2", "p3", "p4", "p5", "p6"];
      const players = Game.createPlayers(playersNames);
      const lawsDeck = makeLawsDeck("conservative");
      const crisesDeck = makeCrisesDeck();
      const rounds = Array.from(
        {
          length: n,
        },
        (_, i) => {
          const legislativeStage = new LegislativeStage(lawsDeck);
          legislativeStage.drawLaws();
          legislativeStage.vetoLaw(0);
          legislativeStage.chooseLawForVoting(1);
          legislativeStage.startVoting(playersNames);
          for (const player of players) {
            legislativeStage.vote(player.name, true);
          }
          return new Round({
            crisesDeck,
            lawsDeck,
            president: players[i % players.length],
            nextPresident: players[i + (1 % players.length)],
            stages: [legislativeStage],
          });
        }
      );
      const [error, game] = Game.create({
        crisesDeck,
        lawsDeck,
        players,
        lawsToConservativeWin: n,
        presidentQueue: [...players],
        rounds,
      });
      expect(error).toBeUndefined();
      expect(game).toBeDefined();
      expect(game?.approvedLaws).toHaveLength(n);
      expect(game!.winner).toBe(Role.CONSERVADOR);
    }
  );

  it("deve declarar conservador vencedor se cassar radical", () => {
    const playersNames = ["p1", "p2", "p3", "p4", "p5", "p6"];
    const players = Game.createPlayers(playersNames);
    const lawsDeck = makeLawsDeck("conservative");
    const crisesDeck = makeCrisesDeck();
    const radical = players.find((p) => p.role === Role.RADICAL)!;
    const accuser = players.find((p) => p !== radical)!;
    const impeachmentStage = new ImpeachmentStage(accuser);
    impeachmentStage.chooseTarget(radical);
    impeachmentStage.startVoting(playersNames);
    for (const player of players) {
      impeachmentStage.vote(player.name, true);
    }
    const rounds = [
      new Round({
        crisesDeck,
        lawsDeck,
        president: players[0],
        nextPresident: players[1],
        stages: [impeachmentStage],
      }),
    ];
    const [error, game] = Game.create({
      crisesDeck,
      lawsDeck,
      players,
      presidentQueue: [...players],
      rounds,
    });
    expect(error).toBeUndefined();
    expect(game).toBeDefined();
    expect(game!.winner).toBe(Role.CONSERVADOR);
  });

  it("deve declarar radical vencedor se cassar 2 conservadores", () => {
    const playersNames = ["p1", "p2", "p3", "p4", "p5", "p6"];
    const players = Game.createPlayers(playersNames);
    const lawsDeck = makeLawsDeck("conservative");
    const crisesDeck = makeCrisesDeck();
    const conservatives = players.filter((p) => p.role === Role.CONSERVADOR);
    const accuser = players.find((p) => p.role !== Role.CONSERVADOR)!;

    const stages = conservatives.map((target) => {
      const impeachmentStage = new ImpeachmentStage(accuser);
      impeachmentStage.chooseTarget(target);
      impeachmentStage.startVoting(playersNames);
      for (const player of players) {
        impeachmentStage.vote(player.name, true);
      }
      return impeachmentStage;
    });

    const rounds = [
      new Round({
        crisesDeck,
        lawsDeck,
        president: players[0],
        nextPresident: players[1],
        stages,
      }),
    ];
    const [error, game] = Game.create({
      crisesDeck,
      lawsDeck,
      players,
      conservativesImpeachedToRadicalWin: 2,
      presidentQueue: [...players],
      rounds,
    });
    expect(error).toBeUndefined();
    expect(game).toBeDefined();
    expect(game!.winner).toBe(Role.RADICAL);
  });
});
