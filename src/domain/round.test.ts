import { describe, expect, it } from "vitest";
import { Player } from "./player";
import { LawType, Role } from "./role";
import { Round } from "./round";
import { Deck } from "./deck";
import { Law } from "../data/laws";
import { Crisis } from "./crisis";
import CRISES from "../data/crises";

const makeCrisesDeck = () => {
  const [error, deck] = Deck.create(
    Object.values(CRISES).map(
      (crisis) => new Crisis(crisis.titles, crisis.description, crisis.type)
    )
  );
  if (!deck) {
    throw new Error(error);
  }
  return deck;
};

const makeLawsDeck = (
  laws: Law[] = [
    { description: "Lei 1", type: LawType.CONSERVADORES, name: "L1" },
    { description: "Lei 2", type: LawType.CONSERVADORES, name: "L2" },
    { description: "Lei 3", type: LawType.CONSERVADORES, name: "L3" },
    { description: "Lei 4", type: LawType.CONSERVADORES, name: "L4" },
  ]
) => {
  const [error, deck] = Deck.create(laws);
  if (!deck) {
    throw new Error(error);
  }
  return deck;
};

describe("Sabotagem", () => {
  it("não deve sabotar uma lei conservadora", () => {
    const round = new Round({
      president: new Player("p1", Role.MODERADO),
      lawsDeck: makeLawsDeck(),
      crisesDeck: makeCrisesDeck(),    });

    round.drawLaws();
    round.chooseLaw(0);
    round.startLawVoting(["p1", "p2", "p3", "p4", "p5", "p6"]);

    const [error] = round.sabotage();

    expect(error).toBe("Não é possível sabotar uma lei conservadora");
  });
  
  it("deve sabotar uma lei progressista", () => {
    const round = new Round({
      president: new Player("p1", Role.MODERADO),
      lawsDeck: makeLawsDeck([
        { description: "Lei 1", type: LawType.PROGRESSISTAS, name: "L1" },
        { description: "Lei 2", type: LawType.PROGRESSISTAS, name: "L2" },
        { description: "Lei 3", type: LawType.PROGRESSISTAS, name: "L3" },
        { description: "Lei 4", type: LawType.PROGRESSISTAS, name: "L4" },
      ]),
      crisesDeck: makeCrisesDeck(),
    });
const players = ["p1", "p2", "p3", "p4", "p5", "p6"];
    round.drawLaws();
    round.chooseLaw(0);
    round.startLawVoting(players);
    for(const player of players) {
      round.voteForLaw(player, true);
    }
    round.endLawVoting();
    const [error, crises] = round.sabotage();

    expect(error).toBeUndefined();
    expect(crises).toBeDefined();
  })

  it("deve escolher 1 crise para sabotagem", () => {
    const round = new Round({
      president: new Player("p1", Role.MODERADO),
      lawsDeck: makeLawsDeck([
        { description: "Lei 1", type: LawType.PROGRESSISTAS, name: "L1" },
        { description: "Lei 2", type: LawType.PROGRESSISTAS, name: "L2" },
        { description: "Lei 3", type: LawType.PROGRESSISTAS, name: "L3" },
        { description: "Lei 4", type: LawType.PROGRESSISTAS, name: "L4" },
      ]),
      crisesDeck: makeCrisesDeck(),
    });
    const players = ["p1", "p2", "p3", "p4", "p5", "p6"];
    round.drawLaws();
    round.chooseLaw(0);
    round.startLawVoting(players);
    for(const player of players) {
      round.voteForLaw(player, true);
    }
    round.endLawVoting();
    const [sabotageError] = round.sabotage();
    expect(sabotageError).toBeUndefined();
    const [error] = round.chooseSabotageCrisis(0);
    expect(error).toBeUndefined();
    expect(round.sabotageCrisis).not.toBeNull();
  })
});

describe("Cassação", () => {
  it("não deve permitir que presidente inicie cassação, se ela não estiver ativa na rodada", () => {
    const round = new Round({
      president: new Player("p1", Role.MODERADO),
      lawsDeck: makeLawsDeck(),
      crisesDeck: makeCrisesDeck(),
    });

    const [error] = round.startImpeachment(new Player("p2", Role.MODERADO));

    expect(error).toBe("A cassação não está ativa nessa rodada");
  });

  it("deve permitir que presidente inicie cassação, se ela estiver ativa na rodada", () => {
    const round = new Round({
      president: new Player("p1", Role.MODERADO),
      lawsDeck: makeLawsDeck(),
      crisesDeck: makeCrisesDeck(),
      hasImpeachment: true,
    });

    const target = new Player("p2", Role.MODERADO);
    const [error] = round.startImpeachment(target);

    expect(error).toBeUndefined();
    expect(round.impeachment?.target).toBe(target);
  })

  it("deve realizar votação de cassação", () => {
    const round = new Round({
      president: new Player("p1", Role.RADICAL),
      lawsDeck: makeLawsDeck(),
      crisesDeck: makeCrisesDeck(),
      hasImpeachment: true,
    });

    const target = new Player("p2", Role.MODERADO);
    const [error] = round.startImpeachment(target);
    expect(error).toBeUndefined();
    expect(round.impeachment).toBeDefined();
    const [startVotingError] = round.startImpeachmentVoting(["p1", "p2"]);
    expect(startVotingError).toBeUndefined();
    round.voteForImpeachment("p1", true);
    round.voteForImpeachment("p2", true);
    expect(round.impeachmentVotingCount).toEqual({
      yes: 2,
      no: 0,
      abstention: 0,
    });
  })
});