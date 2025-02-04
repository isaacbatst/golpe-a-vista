import { expect, it } from "vitest";
import { Game } from "./game";

it('não deve iniciar um jogo com menos de 6 jogadores', () => {
  const [error, lobby] = Game.create([
    "p1",
    "p2",
    "p3",
    "p4",
    "p5",
  ]);
  expect(error).toBe("Mínimo de 6 jogadores para iniciar o jogo");
  expect(lobby).toBeUndefined();
})

it("deve iniciar um jogo com 6 jogadores", () => {
  const [error, game] = Game.create([
    "p1",
    "p2",
    "p3",
    "p4",
    "p5",
    "p6",
  ]);
  expect(error).toBeUndefined();
  expect(game).toBeDefined();
});