import { describe, expect, it } from "vitest";
import { Impeachment } from "./impeachment";
import { Player } from "./player";
import { Role } from "./role";

describe("Impeachment", () => {
  it("deve exigir votação por padrão", () => {
    const impeachment = new Impeachment({
      accuser: new Player("p1", Role.MODERADO),
      target: new Player("p2", Role.MODERADO),
      isSomeConservativeImpeached: false,
    });

    const shouldSkipVoting = impeachment.shouldSkipVoting;
    expect(shouldSkipVoting).toBe(false);

    const [error] = impeachment.impeach();
    expect(error).toBe("Impeachment requer votação");
  });

  it("deve realizar votação", () => {
    const impeachment = new Impeachment({
      accuser: new Player("p1", Role.RADICAL),
      target: new Player("p2", Role.MODERADO),
      isSomeConservativeImpeached: true,
    });

    impeachment.startVoting(["p1", "p2"]);
    impeachment.vote("p1", true);
    impeachment.vote("p2", true);
    const [error, result] = impeachment.impeach();
    expect(error).toBeUndefined();
    expect(result).toBe(true);
    expect(impeachment.target.impeached).toBe(true);
  })

  it("deve realizar votação e não cassar se resultado for falso", () => {
    const impeachment = new Impeachment({
      accuser: new Player("p1", Role.RADICAL),
      target: new Player("p2", Role.MODERADO),
      isSomeConservativeImpeached: true,
    });

    impeachment.startVoting(["p1", "p2"]);
    impeachment.vote("p1", true);
    impeachment.vote("p2", false);
    const [error, result] = impeachment.impeach();
    expect(error).toBeUndefined();
    expect(result).toBe(false);
    expect(impeachment.target.impeached).toBe(false);
  });

  it("deve permitir pular votação se alvo for conservador e um conservador já tiver sido cassado", () => {
    const impeachment = new Impeachment({
      accuser: new Player("p1", Role.MODERADO),
      target: new Player("p2", Role.CONSERVADOR),
      isSomeConservativeImpeached: true,
    });

    const shouldSkipVoting = impeachment.shouldSkipVoting;
    expect(shouldSkipVoting).toBe(true);
    const [error] = impeachment.impeach();
    expect(error).toBeUndefined();
    expect(impeachment.target.impeached).toBe(true);
  });

  it("não deve permitir iniciar votação se não for necessário", () => {
    const impeachment = new Impeachment({
      accuser: new Player("p1", Role.RADICAL),
      target: new Player("p2", Role.CONSERVADOR),
      isSomeConservativeImpeached: true,
    });

    const [error] = impeachment.startVoting(["p1", "p2"]);
    expect(error).toBe("Votação não é necessária");
  });

  it("não deve permitir votar sem iniciar votação", () => {
    const impeachment = new Impeachment({
      accuser: new Player("p1", Role.RADICAL),
      target: new Player("p2", Role.MODERADO),
      isSomeConservativeImpeached: true,
    });

    const [error] = impeachment.vote("p1", true);
    expect(error).toBe("Votação não iniciada");
  });
});
