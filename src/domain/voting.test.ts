import { expect, it } from "vitest";
import { Voting } from "./voting";

it("deve iniciar uma votação sobre a lei 1", () => {
  const [error, voting] = Voting.create("Lei 1", [
    'p1',
    'p2',
    'p3',
    'p4',
    'p5',
    'p6',
  ]);

  expect(error).toBeUndefined();
  expect(voting).toBeDefined();
  expect(voting!.subject).toBe("Lei 1");
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
})  