import { beforeEach, expect, it } from 'vitest';
import { Lobby } from './lobby';
import { User } from './user';
import { Deck } from './deck';
import { Law } from '../data/laws';
import { SabotageCard } from './sabotage-card/sabotage-card';
import { makeSabotageCardsDeck, makeLawsDeck } from './mock';

let lawsDeck: Deck<Law>;
let sabotageCardsDeck: Deck<SabotageCard>;

beforeEach(() => {
  lawsDeck = makeLawsDeck();
  sabotageCardsDeck = makeSabotageCardsDeck();
});

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
  const [addPlayerError] = lobby!.addUser(new User({ id: 'p1', name: 'p1' }));
  expect(addPlayerError).toBeUndefined();
});

it('não deve adicionar o mesmo jogador duas vezes', () => {
  const [error, lobby] = Lobby.create();
  expect(error).toBeUndefined();
  lobby!.addUser(new User({ id: 'p1', name: 'p1' }));
  const [addPlayerError] = lobby!.addUser(new User({ id: 'p1', name: 'p1' }));
  expect(addPlayerError).toBe('Jogador p1 já está no lobby');
});

it('deve criar um lobby sem jogo', () => {
  const [error, lobby] = Lobby.create();
  expect(error).toBeUndefined();
  expect(lobby!.games.length).toBe(0);
});

it('deve retornar o mínimo de jogadores para iniciar o jogo', () => {
  const [error, lobby] = Lobby.create();
  expect(error).toBeUndefined();
  expect(lobby!.minPlayers).toBe(6);
});

it('deve iniciar um jogo com 6 jogadores', () => {
  const [error, lobby] = Lobby.create({});
  expect(error).toBeUndefined();
  lobby!.addUser(new User({ id: 'p1', name: 'p1', isHost: true }));
  lobby!.addUser(new User({ id: 'p2', name: 'p2' }));
  lobby!.addUser(new User({ id: 'p3', name: 'p3' }));
  lobby!.addUser(new User({ id: 'p4', name: 'p4' }));
  lobby!.addUser(new User({ id: 'p5', name: 'p5' }));
  lobby!.addUser(new User({ id: 'p6', name: 'p6' }));
  const [startGameError, game] = lobby!.startGame('p1', sabotageCardsDeck, lawsDeck);
  expect(startGameError).toBeUndefined();
  expect(game).toBeDefined();
});

it.each([6, 7, 8, 9])(
  'não deve iniciar um jogo com menos de %d jogadores',
  (n) => {
    const [error, lobby] = Lobby.create({
      minPlayers: n,
    });
    expect(error).toBeUndefined();
    for (let i = 1; i < n; i++) {
      lobby!.addUser(new User({ id: `p${i}`, name: `p${i}`, isHost: i === 1 }));
    }
    const [startGameError] = lobby!.startGame('p1', sabotageCardsDeck, lawsDeck);
    expect(startGameError).toBe(`Mínimo de ${n} jogadores para iniciar o jogo`);
  },
);

it('deve conectar um jogador a um lobby', () => {
  const [error, lobby] = Lobby.create();
  expect(error).toBeUndefined();
  const user = new User({ id: 'p1', name: 'p1-name' });
  lobby!.addUser(user);
  expect(lobby!.isUserConnected('p1')).toBe(false);
  lobby!.connectUser('p1', 'socket-id');
  expect(lobby!.isUserConnected('p1')).toBe(true);
});

it('deve desconectar um jogador de um lobby', () => {
  const [error, lobby] = Lobby.create();
  expect(error).toBeUndefined();
  const user = new User({ id: 'p1', name: 'p1-name' });
  lobby!.addUser(user);
  lobby!.connectUser('p1', 'socket-id');
  expect(lobby!.isUserConnected('p1')).toBe(true);
  lobby!.disconnectUser('p1');
  expect(lobby!.isUserConnected('p1')).toBe(false);
});

it('deve remover um jogador de um lobby', () => {
  const [error, lobby] = Lobby.create();
  expect(error).toBeUndefined();
  const user = new User({ id: 'p1', name: 'p1-name' });
  const host = new User({ id: 'p2', name: 'p2-name', isHost: true });
  lobby!.addUser(user);
  lobby!.addUser(host);
  expect(lobby!.users.length).toBe(2);
  lobby!.removeUser('p1', 'p2');
  expect(lobby!.users.length).toBe(1);
});

it('não deve remover o próprio jogador de um lobby', () => {
  const [error, lobby] = Lobby.create();
  expect(error).toBeUndefined();
  const user = new User({ id: 'p1', name: 'p1-name' });
  const host = new User({ id: 'p2', name: 'p2-name', isHost: true });
  lobby!.addUser(user);
  lobby!.addUser(host);
  expect(lobby!.users.length).toBe(2);
  const [removeError] = lobby!.removeUser('p2', 'p2');
  expect(removeError).toBe('Não é possível remover a si mesmo');
});

it('não deve remover se não for o anfitrião', () => {
  const [error, lobby] = Lobby.create();
  expect(error).toBeUndefined();
  const user = new User({ id: 'p1', name: 'p1-name' });
  const host = new User({ id: 'p2', name: 'p2-name' });
  lobby!.addUser(user);
  lobby!.addUser(host);
  expect(lobby!.users.length).toBe(2);
  const [removeError] = lobby!.removeUser('p1', 'p2');
  expect(removeError).toBe('Apenas o anfitrião pode remover jogadores');
});
