import { describe, expect, it } from "vitest";
import { Game } from "./game";
import { LawType, Role } from "./role";

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
      (p) =>
        p !== game!.president &&
        p !== game?.getPresidentFromQueue(1) &&
        p !== game?.getPresidentFromQueue(2)
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
  it("deve ativar crise a partir de X leis progressistas consecutivas, se aprovadas por um moderado", () => {
    const approveLaw = (game: Game) => {
      game.drawLaws();
      game.chooseLaw(0);
      game.startVoting();
      for (const player of players) {
        game.vote(player, true);
      }
      game.endVoting();
      game.nextRound();
    };
    const progressiveLawsToCrises = 3;
    const players = ["p1", "p2", "p3", "p4", "p5", "p6"];
    const [error, game] = Game.create({
      players,
      laws: [
        {
          description: "Lei progressista 1",
          type: LawType.PROGRESSISTAS,
          name: "L1",
        },
        {
          description: "Lei progressista 2",
          type: LawType.PROGRESSISTAS,
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
      progressiveLawsToCrisis: progressiveLawsToCrises,
    });
    expect(error).toBeUndefined();
    expect(game).toBeDefined();

    for (let i = 1; i <= progressiveLawsToCrises * 2; i++) {
      approveLaw(game!);
      if (i >= progressiveLawsToCrises) {
        expect(game!.currentRound!.crisis).not.toBeNull();
      } else {
        expect(game!.currentRound!.crisis).toBeNull();
      }
    }
  });

  it("deve iniciar a próxima rodada com crise se a lei for rejeitada", () => {
    const players = ["p1", "p2", "p3", "p4", "p5", "p6"];
    const [error, game] = Game.create({
      players,
      laws: [
        {
          description: "Lei progressista 1",
          type: LawType.PROGRESSISTAS,
          name: "L1",
        },
        {
          description: "Lei progressista 2",
          type: LawType.PROGRESSISTAS,
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
  });

  it("deve permitir sabotagem se uma lei progressista foi aprovada nessa rodada", () => {
    const players = ["p1", "p2", "p3", "p4", "p5", "p6"];
    const [error, game] = Game.create({
      players,
      laws: [
        {
          description: "Lei progressista 1",
          type: LawType.PROGRESSISTAS,
          name: "L1",
        },
        {
          description: "Lei progressista 2",
          type: LawType.PROGRESSISTAS,
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
    game!.chooseSabotageCrisis(0);
    game!.nextRound();
    expect(game!.currentRound!.crisis).not.toBeNull();
  });

  it("não deve permitir sabotagem se a lei progressista ainda não foi aprovada nessa rodada", () => {
    const players = ["p1", "p2", "p3", "p4", "p5", "p6"];
    const [error, game] = Game.create({
      players,
      laws: [
        {
          description: "Lei progressista 1",
          type: LawType.PROGRESSISTAS,
          name: "L1",
        },
        {
          description: "Lei progressista 2",
          type: LawType.PROGRESSISTAS,
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
    const [sabotageError] = game!.sabotage();
    expect(sabotageError).toBe("Não é possível sabotar uma lei que não foi aprovada");
  });

  it("não deve permitir sabotagens em duas rodadas consecutivas", () => {
    const players = ["p1", "p2", "p3", "p4", "p5", "p6"];
    const [error, game] = Game.create({
      players,
      laws: [
        {
          description: "Lei progressista 1",
          type: LawType.PROGRESSISTAS,
          name: "L1",
        },
        {
          description: "Lei progressista 2",
          type: LawType.PROGRESSISTAS,
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
    game!.chooseSabotageCrisis(0);
    game!.nextRound();
    game!.drawLaws();
    game!.chooseLaw(0);
    game!.startVoting();
    for (const player of players) {
      game!.vote(player, true);
    }
    game!.endVoting();
    const [canSabotageError] = game!.canSabotage();
    expect(canSabotageError).toBe("Não é possível sabotar duas vezes seguidas");
  });
});

describe("Cassação", () => {
  it("deve ativar cassação a partir da Xª lei conservadora somente se lei conservadora foi aprovada", () => {
    const players = ["p1", "p2", "p3", "p4", "p5", "p6"];
    const minConservativeLawsToImpeach = 5;
    const [error, game] = Game.create({
      players,
      minConservativeLawsToImpeach: 5,
      laws: Array.from({ length: 9 }, (_, i) => ({
        description: `Lei conservadora ${i + 1}`,
        type: LawType.CONSERVADORES,
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

    for (let i = 0; i < minConservativeLawsToImpeach; i++) {
      game!.drawLaws();
      game!.chooseLaw(0);
      game!.startVoting();
      for (const player of players) {
        game!.vote(player, true);
      }
      game!.endVoting();
      expect(game!.currentRound!.impeachment).toBe(false);
      game!.nextRound();
    }

    expect(game!.currentRound!.impeachment).toBe(true);
  
    game!.drawLaws();
    game!.chooseLaw(0);
    game!.startVoting();
    for (const player of players) {
      game!.vote(player, false);
    }
    game!.endVoting();
    game!.nextRound();

    expect(game!.currentRound!.impeachment).toBe(false);
  });

  it("deve ativar cassação a cada X crises", () => {
    const players = ["p1", "p2", "p3", "p4", "p5", "p6"];
    const crisesIntervalToImpeach = 2;
    const [error, game] = Game.create({
      players,
      laws: Array.from({ length: 10 }, (_, i) => ({
        description: `Lei conservadora ${i + 1}`,
        type: LawType.PROGRESSISTAS,
        name: `L${i + 1}`,
      })),
      crisesIntervalToImpeach,
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

    for (let i = 0; i < 4; i++) {
      game!.drawLaws();
      game!.chooseLaw(0);
      game!.startVoting();
      for (const player of players) {
        game!.vote(player, true);
      }
      game!.endVoting();
      game!.nextRound();
    }

    expect(game!.currentRound!.impeachment).toBe(true);
  })

  it("não deve cassar jogador se a cassação estiver desativada", () => {
    const players = ["p1", "p2", "p3", "p4", "p5", "p6"];
    const [error, game] = Game.create({
      players,
      laws: Array.from({ length: 9 }, (_, i) => ({
        description: `Lei conservadora ${i + 1}`,
        type: LawType.CONSERVADORES,
        name: `L${i + 1}`,
      })),
    });
    expect(error).toBeUndefined();
    expect(game).toBeDefined();

    const [impeachError] = game!.impeach(game!.players[0]);
    expect(impeachError).toBe("A cassação não está ativa");
  });

  it("deve cassar jogador se a cassação estiver ativada", () => {
    const players = ["p1", "p2", "p3", "p4", "p5", "p6"];
    const [error, game] = Game.create({
      players,
      laws: Array.from({ length: 9 }, (_, i) => ({
        description: `Lei conservadora ${i + 1}`,
        type: LawType.CONSERVADORES,
        name: `L${i + 1}`,
      })),
    });
    expect(error).toBeUndefined();
    expect(game).toBeDefined();

    for (let i = 0; i < game!.minConservativeLawsToImpeach; i++) {
      game!.drawLaws();
      game!.chooseLaw(0);
      game!.startVoting();
      for (const player of players) {
        game!.vote(player, true);
      }
      game!.endVoting();
      game!.nextRound();
    }

    const [impeachError] = game!.impeach(game!.players[0]);
    expect(impeachError).toBeUndefined();
  });

  it("não deve permitir voto de jogador cassado", () => {
    const players = ["p1", "p2", "p3", "p4", "p5", "p6"];
    const [error, game] = Game.create({
      players,
      laws: Array.from({ length: 9 }, (_, i) => ({
        description: `Lei conservadora ${i + 1}`,
        type: LawType.CONSERVADORES,
        name: `L${i + 1}`,
      })),
    });
    expect(error).toBeUndefined();
    expect(game).toBeDefined();
    for (let i = 0; i < game!.minConservativeLawsToImpeach; i++) {
      game!.drawLaws();
      game!.chooseLaw(0);
      game!.startVoting();
      for (const player of players) {
        game!.vote(player, true);
      }
      game!.endVoting();
      game!.nextRound();
    }

    const nonPresident = game!.players.find((p) => p !== game!.president);
    game!.impeach(nonPresident!);
    game!.drawLaws();
    game!.chooseLaw(0);
    game!.startVoting();
    const [voteError] = game!.vote(nonPresident!.name, true);
    expect(voteError).toBe("Jogador não pode votar");
    const canVote = game!.canVote(nonPresident!.name);
    expect(canVote).toBe(false);
  });

  it("deve pular jogador cassado na fila de presidente", () => {
    const players = ["p1", "p2", "p3", "p4", "p5", "p6"];
    const [error, game] = Game.create({
      players,
      laws: Array.from({ length: 9 }, (_, i) => ({
        description: `Lei conservadora ${i + 1}`,
        type: LawType.CONSERVADORES,
        name: `L${i + 1}`,
      })),
    });
    expect(error).toBeUndefined();
    expect(game).toBeDefined();

    for (let i = 0; i < game!.minConservativeLawsToImpeach; i++) {
      game!.drawLaws();
      game!.chooseLaw(0);
      game!.startVoting();
      for (const player of players) {
        game!.vote(player, true);
      }
      game!.endVoting();
      game!.nextRound();
    }

    const nextPresident = game!.getPresidentFromQueue(
      game!.currentRoundIndex + 1
    );
    game!.impeach(nextPresident!);
    game!.nextRound();

    expect(game!.president).not.toBe(nextPresident);
  });

  it("não deve permitir jogador cassado como relator do dossiê", () => {
    const players = ["p1", "p2", "p3", "p4", "p5", "p6"];
    const [error, game] = Game.create({
      players,
      laws: Array.from({ length: 9 }, (_, i) => ({
        description: `Lei conservadora ${i + 1}`,
        type: LawType.CONSERVADORES,
        name: `L${i + 1}`,
      })),
    });
    expect(error).toBeUndefined();
    expect(game).toBeDefined();

    for (let i = 0; i < game!.minConservativeLawsToImpeach; i++) {
      game!.drawLaws();
      game!.chooseLaw(0);
      game!.startVoting();
      for (const player of players) {
        game!.vote(player, true);
      }
      game!.endVoting();
      game!.nextRound();
    }

    const nonPresident = game!.players.find((p) => p !== game!.president);
    game!.impeach(nonPresident!);
    const [chooseError] = game!.chooseDossierRapporteur(nonPresident!);
    expect(chooseError).toBe("O relator não pode ter sido cassado");
  });
});

describe("Condições de Vitória", () => {
  it("deve declarar progressista vencedor se aprovar X leis progressistas", () => {
    const players = ["p1", "p2", "p3", "p4", "p5", "p6"];
    const [error, game] = Game.create({
      players,
      lawsToProgressiveWin: 1,
      laws: [
        {
          description: "Lei progressista 1",
          type: LawType.PROGRESSISTAS,
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

    expect(game!.winner).toBe(LawType.PROGRESSISTAS);
  });

  it("deve declarar conservador vencedor se aprovar X leis conservadoras", () => {
    const players = ["p1", "p2", "p3", "p4", "p5", "p6"];
    const [error, game] = Game.create({
      players,
      lawsToConservativeWin: 1,
      laws: [
        {
          description: "Lei conservadora 1",
          type: LawType.CONSERVADORES,
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

    expect(game!.winner).toBe(LawType.CONSERVADORES);
  });

  it("deve declarar conservador vencedor se cassar radical", () => {
    const players = ["p1", "p2", "p3", "p4", "p5", "p6"];
    const [error, game] = Game.create({
      players,
      laws: [
        {
          description: "Lei conservadora 1",
          type: LawType.CONSERVADORES,
          name: "L1",
        },
      ],
    });
    expect(error).toBeUndefined();
    expect(game).toBeDefined();

    for (let i = 0; i < game!.minConservativeLawsToImpeach; i++) {
      game!.drawLaws();
      game!.chooseLaw(0);
      game!.startVoting();
      for (const player of players) {
        game!.vote(player, true);
      }
      game!.endVoting();
      game!.nextRound();
    }

    const radical = game!.players.find((p) => p.role === Role.RADICAL);
    const [impeachError] = game!.impeach(radical!);
    expect(impeachError).toBeUndefined();
    expect(game!.winner).toBe(LawType.CONSERVADORES);
  })

  it("deve declarar progressista vencedor se cassar todos os conservadores", () => {
    const players = ["p1", "p2", "p3", "p4", "p5", "p6"];
    const [error, game] = Game.create({
      players,
      laws: [
        {
          description: "Lei conservadora 1",
          type: LawType.CONSERVADORES,
          name: "L1",
        },
      ],
    });
    expect(error).toBeUndefined();
    expect(game).toBeDefined();

    for (let i = 0; i < game!.minConservativeLawsToImpeach; i++) {
      game!.drawLaws();
      game!.chooseLaw(0);
      game!.startVoting();
      for (const player of players) {
        game!.vote(player, true);
      }
      game!.endVoting();
      game!.nextRound();
    }

    const conservative = game!.players.find((p) => p.role === Role.CONSERVADOR);
    const [impeachError] = game!.impeach(conservative!);
    expect(impeachError).toBeUndefined();


    for (let i = 0; i < game!.minConservativeLawsToImpeach; i++) {
      game!.drawLaws();
      game!.chooseLaw(0);
      game!.startVoting();
      for (const player of players) {
        game!.vote(player, true);
      }
      game!.endVoting();
      game!.nextRound();
    }

    const conservative2 = game!.players.find((p) => p.role === Role.CONSERVADOR && p !== conservative);
    const [impeachError2] = game!.impeach(conservative2!);
    expect(impeachError2).toBeUndefined();
    expect(game!.winner).toBe(LawType.PROGRESSISTAS);
  })
})
