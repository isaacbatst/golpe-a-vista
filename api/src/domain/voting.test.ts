import { expect, it } from 'vitest';
import { Voting } from './voting';

it('deve iniciar uma votação sobre a lei 1', () => {
  const [error, voting] = Voting.create(['p1', 'p2', 'p3', 'p4', 'p5', 'p6']);

  expect(error).toBeUndefined();
  expect(voting).toBeDefined();
  expect(voting!.votes).toHaveLength(6);

  expect(voting!.votes.get('p1')).toBeNull();
  expect(voting!.votes.get('p2')).toBeNull();
  expect(voting!.votes.get('p3')).toBeNull();
  expect(voting!.votes.get('p4')).toBeNull();
  expect(voting!.votes.get('p5')).toBeNull();
  expect(voting!.votes.get('p6')).toBeNull();
  for (const [, vote] of voting!.votes) {
    expect(vote).toBeNull();
  }
});

it('não deve iniciar uma votação com menos de 2 jogadores', () => {
  const [error, voting] = Voting.create(['p1']);

  expect(error).toBe('Mínimo de 2 jogadores para iniciar uma votação');
  expect(voting).toBeUndefined();
});

it('deve salvar o voto dos jogadores', () => {
  const [error, voting] = Voting.create(['p1', 'p2', 'p3', 'p4', 'p5', 'p6']);

  expect(error).toBeUndefined();
  expect(voting).toBeDefined();

  voting!.vote('p1', true);
  voting!.vote('p2', false);
  voting!.vote('p3', true);
  voting!.vote('p4', false);
  voting!.vote('p5', true);
  voting!.vote('p6', false);

  expect(voting!.votes.get('p1')).toBe(true);
  expect(voting!.votes.get('p2')).toBe(false);
  expect(voting!.votes.get('p3')).toBe(true);
  expect(voting!.votes.get('p4')).toBe(false);
  expect(voting!.votes.get('p5')).toBe(true);
  expect(voting!.votes.get('p6')).toBe(false);
});

it('deve contar os votos', () => {
  const [error, voting] = Voting.create(['p1', 'p2', 'p3', 'p4', 'p5', 'p6']);

  expect(error).toBeUndefined();
  expect(voting).toBeDefined();

  voting!.vote('p1', true);
  voting!.vote('p2', false);
  voting!.vote('p3', true);
  voting!.vote('p4', false);
  voting!.vote('p5', true);
  voting!.vote('p6', false);

  expect(voting!.count).toEqual({
    yes: 3,
    no: 3,
    abstention: 0,
  });
});

it('deve determinar que sim ganhou quando houver maioria de yes', () => {
  const [error, voting] = Voting.create(['p1', 'p2', 'p3', 'p4', 'p5', 'p6']);

  expect(error).toBeUndefined();
  expect(voting).toBeDefined();

  voting!.vote('p1', true);
  voting!.vote('p2', false);
  voting!.vote('p3', true);
  voting!.vote('p4', false);
  voting!.vote('p5', true);
  voting!.vote('p6', true);
  voting?.end();
  expect(voting!.result).toBe(true);
});

it('deve determinar que não ganhou quando houver empate', () => {
  const [error, voting] = Voting.create(['p1', 'p2', 'p3', 'p4', 'p5', 'p6']);

  expect(error).toBeUndefined();
  expect(voting).toBeDefined();

  voting!.vote('p1', true);
  voting!.vote('p2', false);
  voting!.vote('p3', true);
  voting!.vote('p4', false);
  voting!.vote('p5', true);
  voting!.vote('p6', false);
  voting?.end();
  expect(voting!.result).toBe(false);
});

it('deve finalizar automaticamente quando todos votaram', () => {
  const [error, voting] = Voting.create(['p1', 'p2', 'p3', 'p4', 'p5', 'p6']);

  expect(error).toBeUndefined();
  expect(voting).toBeDefined();

  voting!.vote('p1', true);
  voting!.vote('p2', false);
  voting!.vote('p3', true);
  voting!.vote('p4', false);
  voting!.vote('p5', true);
  voting!.vote('p6', false);
  expect(voting!.hasEnded).toBe(true);
});
