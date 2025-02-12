import { beforeEach, expect, it } from 'vitest';
import { Lobby } from './lobby';
import { User } from './user';
import { Deck } from './deck';
import { Law } from '../data/laws';
import { Crisis } from './crisis/crisis';
import { makeCrisesDeck, makeLawsDeck } from './mock';

let lawsDeck: Deck<Law>;
let crisesDeck: Deck<Crisis>;

beforeEach(() => {
  lawsDeck = makeLawsDeck();
  crisesDeck = makeCrisesDeck();
});

it('deve criar um lobby', () => {
  const [error, lobby] = Lobby.create({
    crisesDeck,
    lawsDeck,
  });
  expect(error).toBeUndefined();
  expect(lobby).toBeDefined();
});

it('deve criar um lobby sem jogadores', () => {
  const [error, lobby] = Lobby.create({
    crisesDeck,
    lawsDeck,
  });
  expect(error).toBeUndefined();
  expect(lobby!.users).toEqual([]);
});

it('deve adicionar um jogador ao lobby', () => {
  const [error, lobby] = Lobby.create({
    crisesDeck,
    lawsDeck,
  });
  expect(error).toBeUndefined();
  const [addPlayerError] = lobby!.addPlayer(new User({ id: 'p1', name: 'p1' }));
  expect(addPlayerError).toBeUndefined();
});

it('não deve adicionar o mesmo jogador duas vezes', () => {
  const [error, lobby] = Lobby.create({
    crisesDeck,
    lawsDeck,
  });
  expect(error).toBeUndefined();
  lobby!.addPlayer(new User({ id: 'p1', name: 'p1' }));
  const [addPlayerError] = lobby!.addPlayer(new User({ id: 'p1', name: 'p1' }));
  expect(addPlayerError).toBe('Jogador p1 já está no lobby');
});

it('deve criar um lobby sem jogo', () => {
  const [error, lobby] = Lobby.create({
    crisesDeck,
    lawsDeck,
  });
  expect(error).toBeUndefined();
  expect(lobby!.games.length).toBe(0);
});

it('deve retornar o mínimo de jogadores para iniciar o jogo', () => {
  const [error, lobby] = Lobby.create({
    crisesDeck,
    lawsDeck,
  });
  expect(error).toBeUndefined();
  expect(lobby!.minPlayers).toBe(7);
});

it('deve iniciar um jogo com 7 jogadores', () => {
  const [error, lobby] = Lobby.create({
    crisesDeck,
    lawsDeck,
  });
  expect(error).toBeUndefined();
  lobby!.addPlayer(new User({ id: 'p1', name: 'p1' }));
  lobby!.addPlayer(new User({ id: 'p2', name: 'p2' }));
  lobby!.addPlayer(new User({ id: 'p3', name: 'p3' }));
  lobby!.addPlayer(new User({ id: 'p4', name: 'p4' }));
  lobby!.addPlayer(new User({ id: 'p5', name: 'p5' }));
  lobby!.addPlayer(new User({ id: 'p6', name: 'p6' }));
  lobby!.addPlayer(new User({ id: 'p7', name: 'p7' }));
  const [startGameError, game] = lobby!.startGame();
  expect(startGameError).toBeUndefined();
  expect(game).toBeDefined();
});

it.each([6, 7, 8, 9])(
  'não deve iniciar um jogo com menos de %d jogadores',
  (n) => {
    const [error, lobby] = Lobby.create({
      minPlayers: n,
      crisesDeck,
      lawsDeck,
    });
    expect(error).toBeUndefined();
    for (let i = 1; i < n; i++) {
      lobby!.addPlayer(new User({ id: `p${i}`, name: `p${i}` }));
    }
    const [startGameError] = lobby!.startGame();
    expect(startGameError).toBe(`Mínimo de ${n} jogadores para iniciar o jogo`);
  },
);
