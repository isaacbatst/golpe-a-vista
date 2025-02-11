import { expect, it } from "vitest";
import { Deck } from "./deck";

it("deve criar um deck", () => {
  const [error, deck] = Deck.create([1,2,3,4])
  expect(error).toBeUndefined();
  expect(deck).toBeDefined();
})

it("não deve criar um deck vaio", () => {
  const [error, deck] = Deck.create([])
  expect(error).toBe("O baralho não pode ser vazio");
  expect(deck).toBeUndefined();
})

it("deve comprar uma carta do deck", () => {
  const [error, deck] = Deck.create([1,2,3,4])
  expect(error).toBeUndefined();
  const cards = deck!.draw();
  expect(cards).toHaveLength(1);
  expect(cards[0]).toBeOneOf([1,2,3,4]);
})