import { describe, expect, it } from "vitest";
import { Player } from "./player";
import { Faction, Role } from "./role";
import { Round } from "./round";

describe("Votação", () => {
  it("deve comprar 2 cartas do deck de leis", () => {
    const round = new Round({
      president: new Player("p1", Role.MODERADO),
    });

    round.setDrawnLaws([
      { description: "Lei 1", type: Faction.GOLPISTAS, name: "L1" },
      { description: "Lei 2", type: Faction.GOLPISTAS, name: "L2" },
    ]);

    expect(round.drawnLaws).toHaveLength(2);
  });

  it("deve escolher uma das leis para votação", () => {
    const round = new Round({
      president: new Player("p1", Role.MODERADO),
    });

    round.setDrawnLaws([
      { description: "Lei 1", type: Faction.GOLPISTAS, name: "L1" },
      { description: "Lei 2", type: Faction.GOLPISTAS, name: "L2" },
    ]);
    const laws = round.drawnLaws;
    const law = laws[0];
    round.chooseLaw(0);

    expect(round.lawToVote).toBe(law);
  });

  it("não deve iniciar votação sem escolher uma lei", () => {
    const round = new Round({
      president: new Player("p1", Role.MODERADO),
    });

    const [error] = round.startVoting(["p1", "p2", "p3", "p4", "p5", "p6"]);

    expect(error).toBe("Nenhuma lei escolhida para votação");
  });

  it("deve iniciar uma votação", () => {
    const round = new Round({
      president: new Player("p1", Role.MODERADO),
    });

    round.setDrawnLaws([
      { description: "Lei 1", type: Faction.GOLPISTAS, name: "L1" },
      { description: "Lei 2", type: Faction.GOLPISTAS, name: "L2" },
    ]);
    round.chooseLaw(0);
    round.startVoting(["p1", "p2", "p3", "p4", "p5", "p6"]);

    expect(round.voting).not.toBeNull();
  });

  it("não deve iniciar votação duas vezes", () => {
    const round = new Round({
      president: new Player("p1", Role.MODERADO),
    });

    round.setDrawnLaws([
      { description: "Lei 1", type: Faction.GOLPISTAS, name: "L1" },
      { description: "Lei 2", type: Faction.GOLPISTAS, name: "L2" },
    ]);
    round.chooseLaw(0);
    round.startVoting(["p1", "p2", "p3", "p4", "p5", "p6"]);

    const [error] = round.startVoting(["p1", "p2", "p3", "p4", "p5", "p6"]);

    expect(error).toBe("Votação já iniciada");
  });

  it("deve permitir ver dados da votação em andamento", () => {
    const round = new Round({
      president: new Player("p1", Role.MODERADO),
    });

    round.setDrawnLaws([
      { description: "Lei 1", type: Faction.GOLPISTAS, name: "L1" },
      { description: "Lei 2", type: Faction.GOLPISTAS, name: "L2" },
    ]);
    round.chooseLaw(0);
    round.startVoting(["p1", "p2", "p3", "p4", "p5", "p6"]);

    round.vote("p1", true);
    round.vote("p2", true);
    round.vote("p3", true);
    round.vote("p4", false);
    round.vote("p5", false);
    round.vote("p6", false);

    expect(round.votingCount).toEqual({
      yes: 3,
      no: 3,
      abstention: 0,
    });
    const votes = round.votes;
    expect(votes).not.toBeNull();
    expect(votes!.get("p1")).toBe(true);
    expect(votes!.get("p2")).toBe(true);
    expect(votes!.get("p3")).toBe(true);
    expect(votes!.get("p4")).toBe(false);
    expect(votes!.get("p5")).toBe(false);
    expect(votes!.get("p6")).toBe(false);
  });

  it("deve finalizar a votação", () => {
    const round = new Round({
      president: new Player("p1", Role.MODERADO),
    });

    round.setDrawnLaws([
      { description: "Lei 1", type: Faction.GOLPISTAS, name: "L1" },
      { description: "Lei 2", type: Faction.GOLPISTAS, name: "L2" },
    ]);
    round.chooseLaw(0);
    round.startVoting(["p1", "p2", "p3", "p4", "p5", "p6"]);

    round.vote("p1", true);
    round.vote("p2", true);
    round.vote("p3", true);
    round.vote("p4", true);
    round.vote("p5", true);
    round.vote("p6", true);

    const [, approvedLaw] = round.endVoting();

    expect(approvedLaw).toBe(round.lawToVote);
  });

  it("deve finalizar votação e, sem maioria, descartar a lei rejeitada", () => {
    const round = new Round({
      president: new Player("p1", Role.MODERADO),
    });

    round.setDrawnLaws([
      { description: "Lei 1", type: Faction.GOLPISTAS, name: "L1" },
      { description: "Lei 2", type: Faction.GOLPISTAS, name: "L2" },
    ]);
    round.chooseLaw(0);
    round.startVoting(["p1", "p2", "p3", "p4", "p5", "p6"]);

    round.vote("p1", true);
    round.vote("p2", true);
    round.vote("p3", false);
    round.vote("p4", false);
    round.vote("p5", false);
    round.vote("p6", false);

    const [, approvedLaw] = round.endVoting();

    expect(approvedLaw).toBeNull();
  });
});
