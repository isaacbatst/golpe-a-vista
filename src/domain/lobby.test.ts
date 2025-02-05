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

it('deve iniciar um jogo com 6 jogadores', () => {
  const [error, lobby] = Lobby.create();
  expect(error).toBeUndefined();
  lobby!.addPlayer("p1");
  lobby!.addPlayer("p2");
  lobby!.addPlayer("p3");
  lobby!.addPlayer("p4");
  lobby!.addPlayer("p5");
  lobby!.addPlayer("p6");
  const [startGameError, game] = lobby!.startGame();
  expect(startGameError).toBeUndefined();
  expect(game).toBeDefined();
});

it("não deve iniciar um jogo com menos de 6 jogadores", () => {
  const [error, lobby] = Lobby.create();
  expect(error).toBeUndefined();
  lobby!.addPlayer("p1");
  lobby!.addPlayer("p2");
  lobby!.addPlayer("p3");
  lobby!.addPlayer("p4");
  lobby!.addPlayer("p5");
  const [startGameError] = lobby!.startGame();
  expect(startGameError).toBe("Mínimo de 6 jogadores para iniciar o jogo");
});
