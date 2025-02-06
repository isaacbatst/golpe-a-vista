import { describe, expect, it } from "vitest";
import { Game } from "./game";
import { Faction, Role } from "./role";

describe("Setup e Votação", () => {
  it("deve distribuir jogadores aleatóriamente entre 1 radical, 3 moderados e 2 conservadores", () => {
    const [error, game] = Game.create({
      players: ["p1", "p2", "p3", "p4", "p5", "p6"]
    });
    expect(error).toBeUndefined();
    expect(game).toBeDefined();
    expect(game!.players.filter((p) => p.role === Role.RADICAL).length).toBe(1);
    expect(game!.players.filter((p) => p.role === Role.MODERADO).length).toBe(3);
    expect(game!.players.filter((p) => p.role === Role.CONSERVADOR).length).toBe(
      2
    );
  });
  
  it("deve iniciar a primeira rodada com um jogador aleatório como presidente interino", () => {
    const [error, game] = Game.create({
      players: ["p1", "p2", "p3", "p4", "p5", "p6"]
    });
    expect(error).toBeUndefined();
    expect(game).toBeDefined();
    expect(game?.currentRoundIndex).toBe(0);
    expect(game!.president).toBeDefined();
  });
  
  it("deve iniciar a próxima rodada com o próximo jogador como presidente interino", () => {
    const [error, game] = Game.create({
      players: ["p1", "p2", "p3", "p4", "p5", "p6"]
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
  })
  
  it("deve declarar progressista vencedor se aprovar X leis progressistas", () => {
    const [error, game] = Game.create({
      players: ["p1", "p2", "p3", "p4", "p5", "p6"],
      lawsToProgressiveWin: 1,
      laws: [
        {description: "Lei progressista 1", type: Faction.PROGRESSISTAS, name: "L1"},
      ]
    });
    expect(error).toBeUndefined();
    expect(game).toBeDefined();
  
    for (let i = 0; i < 5; i++) {
      game!.drawLaws();
      game!.chooseLaw(0);
      game!.startVoting();
  
      game!.vote("p1", true);
      game!.vote("p2", true);
      game!.vote("p3", true);
      game!.vote("p4", true);
      game!.vote("p5", true);
      game!.vote("p6", true);
  
      game!.endVoting();
    }
  
    expect(game!.winner).toBe(Faction.PROGRESSISTAS);
  })
})

describe("Dossiê", () => {
  it("não deve permitir que escolha o presidente atual como Relator do dossiê", () => {
    const [error, game] = Game.create({
      players: ["p1", "p2", "p3", "p4", "p5", "p6"],
    });
    expect(error).toBeUndefined();
    expect(game).toBeDefined();
    const president = game!.president;
    const [errorChooseDossierRapporteur] = game!.chooseDossierRapporteur(president);
    expect(errorChooseDossierRapporteur).toBe("O presidente não pode ser o relator");
  });

  it("não deve permitir que escolha o ex-presidente como Relator do dossiê", () => {
    const [, game] = Game.create({
      players: ["p1", "p2", "p3", "p4", "p5", "p6"],
    });
  
    const exPresident = game!.president;
    game!.nextRound();
    const [errorChooseDossierRapporteur] = game!.chooseDossierRapporteur(exPresident);
    expect(errorChooseDossierRapporteur).toBe("O presidente anterior não pode ser o relator");
  });

  it("não deve permitir que escolha o ex-Relator do dossiê como Relator do dossiê", () => {
    const [error, game] = Game.create({
      players: ["p1", "p2", "p3", "p4", "p5", "p6"],
    });
    expect(error).toBeUndefined();
    expect(game).toBeDefined();
    const firstRapporteur = game!.players.find((p) => p !== game!.president && p !== game?.presidentQueue[1]);
    game!.chooseDossierRapporteur(firstRapporteur!);
    game!.nextRound();
    const [errorChooseDossierRapporteur] = game!.chooseDossierRapporteur(firstRapporteur!);
    expect(errorChooseDossierRapporteur).toBe("O relator não pode ser escolhido duas vezes seguidas");
  })
    

  it("deve permitir que ex-presidente escolha um jogador que não o presidente atual para ser o Relator do dossiê", () => {
    const [error, game] = Game.create({
      players: ["p1", "p2", "p3", "p4", "p5", "p6"],
    });
    expect(error).toBeUndefined();
    expect(game).toBeDefined();
  
    game!.drawLaws();
    game!.chooseLaw(0);
    game!.startVoting();
    game!.vote("p1", true);
    game!.vote("p2", true);
    game!.vote("p3", true);
    game!.vote("p4", true);
    game!.vote("p5", true);
    game!.vote("p6", true);
    game!.endVoting();
  
    const president = game!.president;
    const chosen = game!.players.find((p) => p !== president);
    game!.chooseDossierRapporteur(chosen!);
    expect(game!.rapporteur).toBe(chosen);
  })
})
