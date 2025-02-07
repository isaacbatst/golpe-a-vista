import { describe, expect, it } from "vitest";
import { Game } from "./game";
import { Faction, Role } from "./role";

describe("Distribuição de Papéis e Votação", () => {
  it("deve distribuir jogadores aleatóriamente entre 1 radical, 3 moderados e 2 conservadores", () => {
    const [error, game] = Game.create({
      players: ["p1", "p2", "p3", "p4", "p5", "p6"],
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

  it("deve iniciar a primeira rodada com um jogador aleatório como presidente interino", () => {
    const [error, game] = Game.create({
      players: ["p1", "p2", "p3", "p4", "p5", "p6"],
    });
    expect(error).toBeUndefined();
    expect(game).toBeDefined();
    expect(game?.currentRoundIndex).toBe(0);
    expect(game!.president).toBeDefined();
  });

  it("deve iniciar a próxima rodada com o próximo jogador como presidente interino", () => {
    const [error, game] = Game.create({
      players: ["p1", "p2", "p3", "p4", "p5", "p6"],
    });
    expect(error).toBeUndefined();
    expect(game).toBeDefined();

    const firstPresident = game!.president;

    game!.drawLaws();
    game!.chooseLaw(0);
    game!.startVoting();
    const [endVotingError] = game!.endVoting();
    expect(endVotingError).toBeUndefined();

    game!.nextRound();
    expect(game!.currentRoundIndex).toBe(1);
    expect(game!.president).toBeDefined();
    expect(game!.president).not.toBe(firstPresident);
  });

  it("deve declarar progressista vencedor se aprovar X leis progressistas", () => {
    const players = ["p1", "p2", "p3", "p4", "p5", "p6"];
    const [error, game] = Game.create({
      players,
      lawsToProgressiveWin: 1,
      laws: [
        {
          description: "Lei progressista 1",
          type: Faction.PROGRESSISTAS,
          name: "L1",
        },
      ],
    });
    expect(error).toBeUndefined();
    expect(game).toBeDefined();

    for (let i = 0; i < 5; i++) {
      game!.drawLaws();
      game!.chooseLaw(0);
      game!.startVoting();
      for (const player of players) {
        game!.vote(player, true);
      }
      game!.endVoting();
    }

    expect(game!.winner).toBe(Faction.PROGRESSISTAS);
  });
});

describe("Relator do Dossiê", () => {
  it("não deve permitir que escolha o presidente atual como Relator do dossiê", () => {
    const [error, game] = Game.create({
      players: ["p1", "p2", "p3", "p4", "p5", "p6"],
    });
    expect(error).toBeUndefined();
    expect(game).toBeDefined();
    const president = game!.president;
    const [errorChooseDossierRapporteur] =
      game!.chooseDossierRapporteur(president);
    expect(errorChooseDossierRapporteur).toBe(
      "O presidente não pode ser o relator"
    );
  });

  it("não deve permitir que escolha o próximo presidente como Relator do dossiê", () => {
    const [, game] = Game.create({
      players: ["p1", "p2", "p3", "p4", "p5", "p6"],
    });

    const nextPresident = game!.getPresidentFromQueue(1);
    const [errorChooseDossierRapporteur] =
      game!.chooseDossierRapporteur(nextPresident);
    expect(errorChooseDossierRapporteur).toBe(
      "O próximo presidente não pode ser o relator"
    );
  });

  it("não deve permitir que escolha o ex-Relator do dossiê como Relator do dossiê", () => {
    const [error, game] = Game.create({
      players: ["p1", "p2", "p3", "p4", "p5", "p6"],
    });
    expect(error).toBeUndefined();
    expect(game).toBeDefined();
    const firstRapporteur = game!.players.find(
      (p) => p !== game!.president && p !== game?.getPresidentFromQueue(1)  && p !== game?.getPresidentFromQueue(2)
    );
    game!.chooseDossierRapporteur(firstRapporteur!);
    game!.nextRound();
    const [errorChooseDossierRapporteur] = game!.chooseDossierRapporteur(
      firstRapporteur!
    );
    expect(errorChooseDossierRapporteur).toBe(
      "O relator não pode ser escolhido duas vezes seguidas"
    );
  });

  it("deve permitir que escolha um jogador que não o presidente atual nem o próximo para ser o Relator do dossiê", () => {
    const players = ["p1", "p2", "p3", "p4", "p5", "p6"];
    const [error, game] = Game.create({
      players,
    });
    expect(error).toBeUndefined();
    expect(game).toBeDefined();
    const president = game!.president;
    const nextPresident = game!.getPresidentFromQueue(1);
    const chosen = game!.players.find(
      (p) => p !== president && p !== nextPresident
    );
    game!.chooseDossierRapporteur(chosen!);
    game!.nextRound();
    expect(game!.rapporteur).toBe(chosen);
  });
});

describe("Crises", () => {
  it("deve ativar crise a partir de 2 leis progressistas consecutivas, se aprovadas por um moderado", () => {
    const approveLaw = (game: Game) => {
      game.drawLaws();
      game.chooseLaw(0);
      game.startVoting();
      for (const player of players) {
        game.vote(player, true);
      }
      game.endVoting();
    }
    const players = ["p1", "p2", "p3", "p4", "p5", "p6"];
    const [error, game] = Game.create({
      players,
      laws: [
        {
          description: "Lei progressista 1",
          type: Faction.PROGRESSISTAS,
          name: "L1",
        },
        {
          description: "Lei progressista 2",
          type: Faction.PROGRESSISTAS,
          name: "L2",
        },
      ],
      roles: [
        Role.MODERADO,
        Role.MODERADO,
        Role.MODERADO,
        Role.MODERADO,
        Role.MODERADO,
        Role.MODERADO,
      ],
    });
    expect(error).toBeUndefined();
    expect(game).toBeDefined();

    for (let j = 0; j < 4; j++) {
      approveLaw(game!);
      if (j > 1) {
        expect(game!.currentRound!.crisis).not.toBeNull();
      } else {
        expect(game!.currentRound!.crisis).toBeNull();
      }
      game!.nextRound();
    }
  });

  it("deve iniciar a próxima rodada com crise se a lei for rejeitada", () => {
    const players = ["p1", "p2", "p3", "p4", "p5", "p6"];
    const [error, game] = Game.create({
      players,
      laws: [
        {
          description: "Lei progressista 1",
          type: Faction.PROGRESSISTAS,
          name: "L1",
        },
        {
          description: "Lei progressista 2",
          type: Faction.PROGRESSISTAS,
          name: "L2",
        },
      ],
      roles: [
        Role.MODERADO,
        Role.MODERADO,
        Role.MODERADO,
        Role.MODERADO,
        Role.MODERADO,
        Role.MODERADO,
      ],
    });
    expect(error).toBeUndefined();
    expect(game).toBeDefined();
    for (let i = 0; i < 2; i++) {
      game!.drawLaws();
      game!.chooseLaw(0);
      game!.startVoting();
      for (const player of players) {
        game!.vote(player, false);
      }
      game!.endVoting();
      game!.nextRound();
    }
    expect(game!.currentRound!.crisis).not.toBeNull();
  })

  it("deve iniciar próxima rodada com crise se houver sabotagem", () => {
    const players = ["p1", "p2", "p3", "p4", "p5", "p6"];
    const [error, game] = Game.create({
      players,
      laws: [
        {
          description: "Lei progressista 1",
          type: Faction.PROGRESSISTAS,
          name: "L1",
        },
        {
          description: "Lei progressista 2",
          type: Faction.PROGRESSISTAS,
          name: "L2",
        },
      ],
      roles: [
        Role.MODERADO,
        Role.MODERADO,
        Role.MODERADO,
        Role.MODERADO,
        Role.MODERADO,
        Role.CONSERVADOR,
      ],
    });
    expect(error).toBeUndefined();
    expect(game).toBeDefined();
    game!.drawLaws();
    game!.chooseLaw(0);
    game!.startVoting();
    for (const player of players) {
      game!.vote(player, true);
    }
    game!.endVoting();
    game!.sabotage();
    game!.chooseSabotageCrisis(0)
    game!.nextRound();
    expect(game!.currentRound!.crisis).not.toBeNull();
  })

  it("não deve permitir sabotagens em duas rodadas consecutivas", () => {
    const players = ["p1", "p2", "p3", "p4", "p5", "p6"];
    const [error, game] = Game.create({
      players,
      laws: [
        {
          description: "Lei progressista 1",
          type: Faction.PROGRESSISTAS,
          name: "L1",
        },
        {
          description: "Lei progressista 2",
          type: Faction.PROGRESSISTAS,
          name: "L2",
        },
      ],
      roles: [
        Role.MODERADO,
        Role.MODERADO,
        Role.MODERADO,
        Role.MODERADO,
        Role.MODERADO,
        Role.CONSERVADOR,
      ],
    });
    expect(error).toBeUndefined();
    expect(game).toBeDefined();
    game!.drawLaws();
    game!.chooseLaw(0);
    game!.startVoting();
    for (const player of players) {
      game!.vote(player, true);
    }
    game!.endVoting();
    game!.sabotage();
    game!.chooseSabotageCrisis(0)
    game!.nextRound();
    game!.drawLaws();
    game!.chooseLaw(0);
    game!.startVoting();
    for (const player of players) {
      game!.vote(player, true);
    }
    game!.endVoting();
    const can = game!.canSabotage();
    expect(can).toBe(false);  
  })
});

describe("Cassação", () => {
  it("deve ativar cassação a cada 3, 6, 9 leis conservadoras", () => {
    const players = ["p1", "p2", "p3", "p4", "p5", "p6"];
    const [error, game] = Game.create({
      players,
      laws: Array.from({ length: 9 }, (_, i) => ({
        description: `Lei conservadora ${i + 1}`,
        type: Faction.CONSERVADORES,
        name: `L${i + 1}`,
      })),
      roles: [
        Role.MODERADO,
        Role.MODERADO,
        Role.MODERADO,
        Role.MODERADO,
        Role.MODERADO,
        Role.MODERADO,
      ],
    });

    expect(error).toBeUndefined();
    expect(game).toBeDefined();

    for (let i = 1; i <= 9; i++) {
      game!.drawLaws();
      game!.chooseLaw(0);
      game!.startVoting();
      for (const player of players) {
        game!.vote(player, true);
      }
      game!.endVoting();
      game!.nextRound();

      if (i % 3 === 0 && i > 0) {
        expect(game!.currentRound!.impeachment).toBe(true);
      } else {
        expect(game!.currentRound!.impeachment).toBe(false);
      }

    }
  });
});
