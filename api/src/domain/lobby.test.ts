import { expect, it } from 'vitest';
import { Lobby } from './lobby';
import { User } from './user';

it('deve criar um lobby', () => {
  const [error, lobby] = Lobby.create();
  expect(error).toBeUndefined();
  expect(lobby).toBeDefined();
});

it('deve criar um lobby sem jogadores', () => {
  const [error, lobby] = Lobby.create();
  expect(error).toBeUndefined();
  expect(lobby!.users).toEqual([]);
});

it('deve adicionar um jogador ao lobby', () => {
  const [error, lobby] = Lobby.create();
  expect(error).toBeUndefined();
  const [addPlayerError] = lobby!.addPlayer(new User({ id: 'p1', name: 'p1' }));
  expect(addPlayerError).toBeUndefined();
});

it('não deve adicionar o mesmo jogador duas vezes', () => {
  const [error, lobby] = Lobby.create();
  expect(error).toBeUndefined();
  lobby!.addPlayer(new User({ id: 'p1', name: 'p1' }));
  const [addPlayerError] = lobby!.addPlayer(new User({ id: 'p1', name: 'p1' }));
  expect(addPlayerError).toBe('Jogador p1 já está no lobby');
});

it('deve criar um lobby sem jogo', () => {
  const [error, lobby] = Lobby.create();
  expect(error).toBeUndefined();
  expect(lobby!.games.length).toBe(0);
});

it('deve iniciar um jogo com 6 jogadores', () => {
  const [error, lobby] = Lobby.create();
  expect(error).toBeUndefined();
  lobby!.addPlayer(new User({ id: 'p1', name: 'p1' }));
  lobby!.addPlayer(new User({ id: 'p2', name: 'p2' }));
  lobby!.addPlayer(new User({ id: 'p3', name: 'p3' }));
  lobby!.addPlayer(new User({ id: 'p4', name: 'p4' }));
  lobby!.addPlayer(new User({ id: 'p5', name: 'p5' }));
  lobby!.addPlayer(new User({ id: 'p6', name: 'p6' }));
  const [startGameError, game] = lobby!.startGame();
  expect(startGameError).toBeUndefined();
  expect(game).toBeDefined();
});

it('não deve iniciar um jogo com menos de 6 jogadores', () => {
  const [error, lobby] = Lobby.create();
  expect(error).toBeUndefined();
  lobby!.addPlayer(new User({ id: 'p1', name: 'p1' }));
  lobby!.addPlayer(new User({ id: 'p2', name: 'p2' }));
  lobby!.addPlayer(new User({ id: 'p3', name: 'p3' }));
  lobby!.addPlayer(new User({ id: 'p4', name: 'p4' }));
  lobby!.addPlayer(new User({ id: 'p5', name: 'p5' }));
  const [startGameError] = lobby!.startGame();
  expect(startGameError).toBe('Mínimo de 6 jogadores para iniciar o jogo');
});
