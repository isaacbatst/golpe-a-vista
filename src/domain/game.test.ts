import { expect, it } from "vitest";
import { Game } from "./game";
import { Role } from "./role";

it("deve distribuir jogadores aleatóriamente entre 1 radical, 3 moderados e 2 conservadores", () => {
  const [error, game] = Game.create(["p1", "p2", "p3", "p4", "p5", "p6"]);
  expect(error).toBeUndefined();
  expect(game).toBeDefined();
  expect(game!.players.filter((p) => p.role === Role.RADICAL).length).toBe(1);
  expect(game!.players.filter((p) => p.role === Role.MODERADO).length).toBe(3);
  expect(game!.players.filter((p) => p.role === Role.CONSERVADOR).length).toBe(
    2
  );
});

it("deve iniciar a primeira rodada com um jogador aleatório como presidente interino", () => {
  const [error, game] = Game.create(["p1", "p2", "p3", "p4", "p5", "p6"]);
  expect(error).toBeUndefined();
  expect(game).toBeDefined();
  expect(game!.interimPresident).toBeDefined();
});

it("deve comprar 2 cartas do deck de leis", () => {
  const [error, game] = Game.create(["p1", "p2", "p3", "p4", "p5", "p6"]);
  expect(error).toBeUndefined();
  expect(game).toBeDefined();

  game!.drawLaws();

  expect(game!.drawnLaws).toHaveLength(2);
});

it("deve escolher uma das leis para votação", () => {
  const [error, game] = Game.create(["p1", "p2", "p3", "p4", "p5", "p6"]);
  expect(error).toBeUndefined();
  expect(game).toBeDefined();

  game!.drawLaws();

  const laws = game!.drawnLaws;
  const law = laws[0];
  game!.chooseLaw(0);

  expect(game!.lawToVote).toBe(law);
});

it("deve iniciar uma votação", () => {
  const [error, game] = Game.create(["p1", "p2", "p3", "p4", "p5", "p6"]);
  expect(error).toBeUndefined();
  expect(game).toBeDefined();

  game!.drawLaws();
  game!.chooseLaw(0);
  game!.startVoting();

  expect(game!.votingResult).not.toBeNull();
});

it("deve permitir ver o resultado da votação em andamento", () => {
  const [error, game] = Game.create(["p1", "p2", "p3", "p4", "p5", "p6"]);
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
});

it("deve finalizar votação e, com maioria, salvar a lei aprovada", () => {
  const [error, game] = Game.create(["p1", "p2", "p3", "p4", "p5", "p6"]);
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
});
