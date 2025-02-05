import { expect, it } from "vitest";
import { Game } from "./game";
import { Faction, Role } from "./role";

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
  expect(game?.currentRound).toBe(0);
  expect(game!.president).toBeDefined();
});

it("deve comprar 2 cartas do deck de leis", () => {
  const [error, game] = Game.create({
    players: ["p1", "p2", "p3", "p4", "p5", "p6"]
  });
  expect(error).toBeUndefined();
  expect(game).toBeDefined();

  game!.drawLaws();

  expect(game!.drawnLaws).toHaveLength(2);
});

it("deve escolher uma das leis para votação", () => {
  const [error, game] = Game.create({
    players: ["p1", "p2", "p3", "p4", "p5", "p6"]
  });
  expect(error).toBeUndefined();
  expect(game).toBeDefined();

  game!.drawLaws();

  const laws = game!.drawnLaws;
  const law = laws[0];
  game!.chooseLaw(0);

  expect(game!.lawToVote).toBe(law);
});

it("deve iniciar uma votação", () => {
  const [error, game] = Game.create({
    players: ["p1", "p2", "p3", "p4", "p5", "p6"]
  });
  expect(error).toBeUndefined();
  expect(game).toBeDefined();

  game!.drawLaws();
  game!.chooseLaw(0);
  game!.startVoting();

  expect(game!.votingResult).not.toBeNull();
});

it("deve permitir ver o resultado da votação em andamento", () => {
  const [error, game] = Game.create({
    players: ["p1", "p2", "p3", "p4", "p5", "p6"]
  });
  expect(error).toBeUndefined();
  expect(game).toBeDefined();

  game!.drawLaws();
  game!.chooseLaw(0);
  game!.startVoting();

  game!.vote("p1", true);
  game!.vote("p2", true);
  game!.vote("p3", true);
  game!.vote("p4", false);
  game!.vote("p5", false);
  game!.vote("p6", false);

  expect(game!.votingResult).toEqual({
    yes: 3,
    no: 3,
    abstention: 0,
  });
  const votes = game!.votes;
  expect(votes).not.toBeNull();
  expect(votes!.get("p1")).toBe(true);
  expect(votes!.get("p2")).toBe(true);
  expect(votes!.get("p3")).toBe(true);
  expect(votes!.get("p4")).toBe(false);
  expect(votes!.get("p5")).toBe(false);
  expect(votes!.get("p6")).toBe(false);
});

it("deve finalizar votação e, com maioria, salvar a lei aprovada", () => {
  const [error, game] = Game.create({
    players: ["p1", "p2", "p3", "p4", "p5", "p6"]
  });
  expect(error).toBeUndefined();
  expect(game).toBeDefined();

  game!.drawLaws();
  game!.chooseLaw(0);
  game!.startVoting();

  const law = game!.lawToVote;

  game!.vote("p1", true);
  game!.vote("p2", true);
  game!.vote("p3", true);
  game!.vote("p4", true);
  game!.vote("p5", false);
  game!.vote("p6", false);

  game!.endVoting();

  expect(game!.lawToVote).toBeNull();
  expect(game!.drawnLaws).toHaveLength(0);
  expect(game!.approvedLaws).toContain(law);
  expect(game!.votingResult).toBeNull();
  expect(game!.votingHistory).toHaveLength(1);
  expect(game!.votingHistory[0].counting).toEqual({
    yes: 4,
    no: 2,
    abstention: 0,
  });
  expect(game!.votingHistory[0].subject).toBe(law);
  expect(game!.votingHistory[0].result).toBe(true);
});

it("deve finalizar votação e, sem maioria, descartar a lei rejeitada", () => {
  const [error, game] = Game.create({
    players: ["p1", "p2", "p3", "p4", "p5", "p6"]
  });
  expect(error).toBeUndefined();
  expect(game).toBeDefined();

  game!.drawLaws();
  game!.chooseLaw(0);
  game!.startVoting();

  const law = game!.lawToVote;

  game!.vote("p1", true);
  game!.vote("p2", true);
  game!.vote("p3", false);
  game!.vote("p4", false);
  game!.vote("p5", false);
  game!.vote("p6", false);

  game!.endVoting();

  expect(game!.lawToVote).toBeNull();
  expect(game!.drawnLaws).toHaveLength(0);
  expect(game!.approvedLaws).not.toContain(law);
  expect(game!.votingResult).toBeNull();
}); 

it("não deve iniciar a votação se já houver uma em andamento", () => {
  const [error, game] = Game.create({
    players: ["p1", "p2", "p3", "p4", "p5", "p6"]
  });
  expect(error).toBeUndefined();
  expect(game).toBeDefined();

  game!.drawLaws();
  game!.chooseLaw(0);
  game!.startVoting();

  const [startVotingError] = game!.startVoting();
  expect(startVotingError).toBe("Votação já iniciada");
});

it("não deve iniciar a votação sem uma lei escolhida", () => {
  const [error, game] = Game.create({
    players: ["p1", "p2", "p3", "p4", "p5", "p6"]
  });
  expect(error).toBeUndefined();
  expect(game).toBeDefined();

  const [startVotingError] = game!.startVoting();
  expect(startVotingError).toBe("Nenhuma lei escolhida para votação");
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
  game!.endVoting();
  
  game!.nextRound();
  expect(game!.currentRound).toBe(1);
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