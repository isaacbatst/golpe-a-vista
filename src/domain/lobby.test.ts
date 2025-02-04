import {expect, it} from 'vitest';
import { Lobby } from './lobby';

it("deve criar um lobby", () => {
  const [error, lobby] = Lobby.create();
  expect(error).toBeUndefined();
  expect(lobby).toBeDefined();
});

it('deve criar um lobby sem jogadores', () => {
  const [error, lobby] = Lobby.create();
  expect(error).toBeUndefined();
  expect(lobby!.players).toEqual([]);
});

it("deve adicionar um jogador ao lobby", () => {
  const [error, lobby] = Lobby.create();
  expect(error).toBeUndefined();
  const [addPlayerError] = lobby!.addPlayer("p1");
  expect(addPlayerError).toBeUndefined();
});

it('não deve adicionar o mesmo jogador duas vezes', () => {
  const [error, lobby] = Lobby.create();
  expect(error).toBeUndefined();
  lobby!.addPlayer("p1");
  const [addPlayerError] = lobby!.addPlayer("p1");
  expect(addPlayerError).toBe("Jogador p1 já está no lobby");
});

it('não deve iniciar um lobby sem jogadores', () => {

});