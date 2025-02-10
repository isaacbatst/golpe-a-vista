import { PresidentQueue } from "./president-queue";
import { Player } from "./player";
import { Role } from "./role";
import { expect, it } from "vitest";

it("deve pular jogador cassado na fila de presidente", () => {
  const queue = new PresidentQueue(
    Array.from(
      { length: 5 },
      (_, i) => new Player(`Player ${i}`, Role.CONSERVADOR, i === 0)
    )
  );  
  const president = queue.getByRoundNumber(0);
  expect(president.name).toBe("Player 0");
  queue.shift();
  const president2 = queue.getByRoundNumber(0);
  expect(president2.name).toBe("Player 1");
});
