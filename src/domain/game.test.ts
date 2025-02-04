import {expect, it} from 'vitest';
import { Game } from './game';

it("should be able to create a game", () => {
  const [error, game] = Game.create();
  expect(error).toBeUndefined();
  expect(game).toBeDefined();
});

it('should have no players when created', () => {
  const [error, game] = Game.create();
  expect(error).toBeUndefined();
  expect(game!.players).toEqual([]);
});

it("should be able to add a player", () => {
  const [error, game] = Game.create();
  expect(error).toBeUndefined();
  const [addPlayerError] = game!.addPlayer("p1");
  expect(addPlayerError).toBeUndefined();
});

it('should not have players with the same name', () => {
  const [error, game] = Game.create();
  expect(error).toBeUndefined();
  game!.addPlayer("p1");
  const [addPlayerError] = game!.addPlayer("p1");
  expect(addPlayerError).toBe("Jogador p1 já está no jogo");
});