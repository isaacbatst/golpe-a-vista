import { expect, it } from "vitest";
import { Law } from "../../data/laws";
import { Deck } from "../deck";
import { LawType } from "../role";
import { LegislativeAction, LegislativeStage } from "./legislative-stage";
import { Stage } from "./stage";

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

it("deve comprar 3 cartas do deck de leis", () => {
  const stage = new LegislativeStage(makeLawsDeck());
  stage.drawLaws();
  expect(stage.drawnLaws).toHaveLength(3);
});

it("deve vetar uma das leis", () => {
  const stage = new LegislativeStage(makeLawsDeck());
  const [, laws] = stage.drawLaws();
  expect(laws).toBeDefined();
  stage.vetoLaw(0);
  const law = laws![0];
  expect(stage.vetoedLaw).toBe(law);
});

it("não deve escolher uma das leis vetadas", () => {
  const stage = new LegislativeStage(makeLawsDeck());
  stage.drawLaws();
  stage.vetoLaw(0);
  const [error] = stage.chooseLawForVoting(0);
  expect(error).toBe("Essa lei foi vetada.");
});

it("deve escolher uma das leis para votação", () => {
  const stage = new LegislativeStage(makeLawsDeck());
  const [, laws] = stage.drawLaws();
  expect(laws).toBeDefined();
  const law = laws![0];
  stage.vetoLaw(1);
  stage.chooseLawForVoting(0);
  expect(stage.lawToVote).toBe(law);
});

it("não deve iniciar votação sem escolher uma lei", () => {
  const stage = new LegislativeStage(makeLawsDeck());
  const [error] = stage.startVoting(["p1", "p2", "p3", "p4", "p5", "p6"]);
  expect(error).toBe(
    Stage.unexpectedActionMessage(
      LegislativeAction.START_VOTING,
      LegislativeAction.DRAW_LAWS
    )
  );
});

it("não deve iniciar votação duas vezes", () => {
  const stage = new LegislativeStage(makeLawsDeck());
  stage.drawLaws();
  stage.vetoLaw(1);
  stage.chooseLawForVoting(0);
  stage.startVoting(["p1", "p2", "p3", "p4", "p5", "p6"]);
  const [error] = stage.startVoting(["p1", "p2", "p3", "p4", "p5", "p6"]);
  expect(error).toBe(
    Stage.unexpectedActionMessage(
      LegislativeAction.START_VOTING,
      LegislativeAction.VOTING
    )
  );
});

it("deve realizar a votação rejeitando a lei sem maioria", () => {
  const stage = new LegislativeStage(makeLawsDeck());
  stage.drawLaws();
  stage.vetoLaw(1);
  stage.chooseLawForVoting(0);
  stage.startVoting(["p1", "p2", "p3", "p4", "p5", "p6"]);

  const [errorP1] = stage.vote("p1", true);
  expect(errorP1).toBeUndefined();
  const [errorP2] = stage.vote("p2", true);
  expect(errorP2).toBeUndefined();
  const [errorP3] = stage.vote("p3", true);
  expect(errorP3).toBeUndefined();
  const [errorP4] = stage.vote("p4", false);
  expect(errorP4).toBeUndefined();
  const [errorP5] = stage.vote("p5", false);
  expect(errorP5).toBeUndefined();
  const [errorP6] = stage.vote("p6", false);
  expect(errorP6).toBeUndefined();

  expect(stage.votingCount).toEqual({
    yes: 3,
    no: 3,
    abstention: 0,
  });
  const votes = stage.votes;
  expect(votes).not.toBeNull();
  expect(votes!.get("p1")).toBe(true);
  expect(votes!.get("p2")).toBe(true);
  expect(votes!.get("p3")).toBe(true);
  expect(votes!.get("p4")).toBe(false);
  expect(votes!.get("p5")).toBe(false);
  expect(votes!.get("p6")).toBe(false);

  const [error] = stage.endVoting();
  expect(error).toBeUndefined();
  expect(stage.votingResult).toBeFalsy();
});

it("deve realizar a votação aprovando a lei com maioria", () => {
  const stage = new LegislativeStage(makeLawsDeck());
  stage.drawLaws();
  stage.vetoLaw(1);
  stage.chooseLawForVoting(0);
  stage.startVoting(["p1", "p2", "p3", "p4", "p5", "p6"]);

  const [errorP1] = stage.vote("p1", true);
  expect(errorP1).toBeUndefined();
  const [errorP2] = stage.vote("p2", true);
  expect(errorP2).toBeUndefined();
  const [errorP3] = stage.vote("p3", true);
  expect(errorP3).toBeUndefined();
  const [errorP4] = stage.vote("p4", true);
  expect(errorP4).toBeUndefined();
  const [errorP5] = stage.vote("p5", false);
  expect(errorP5).toBeUndefined();
  const [errorP6] = stage.vote("p6", false);
  expect(errorP6).toBeUndefined();

  expect(stage.votingCount).toEqual({
    yes: 4,
    no: 2,
    abstention: 0,
  });
  const votes = stage.votes;
  expect(votes).not.toBeNull();
  expect(votes!.get("p1")).toBe(true);
  expect(votes!.get("p2")).toBe(true);
  expect(votes!.get("p3")).toBe(true);
  expect(votes!.get("p4")).toBe(true);
  expect(votes!.get("p5")).toBe(false);
  expect(votes!.get("p6")).toBe(false);

  const [error] = stage.endVoting();
  expect(error).toBeUndefined();
  expect(stage.votingResult).toBeTruthy();
})


// it("deve finalizar a votação", () => {
//   const round = new Round({
//     president: new Player("p1", Role.MODERADO),
//     lawsDeck: makeLawsDeck(),
//     crisesDeck: makeCrisesDeck(),    });

//   round.drawLaws();
//   round.chooseLaw(0);
//   round.startLawVoting(["p1", "p2", "p3", "p4", "p5", "p6"]);

//   round.voteForLaw("p1", true);
//   round.voteForLaw("p2", true);
//   round.voteForLaw("p3", true);
//   round.voteForLaw("p4", true);
//   round.voteForLaw("p5", true);
//   round.voteForLaw("p6", true);

//   const [, approvedLaw] = round.endLawVoting();

//   expect(approvedLaw).toBe(round.lawToVote);
// });

// it("deve finalizar votação e, sem maioria, descartar a lei rejeitada", () => {
//   const round = new Round({
//     president: new Player("p1", Role.MODERADO),
//     lawsDeck: makeLawsDeck(),
//     crisesDeck: makeCrisesDeck(),    });

//   round.drawLaws();
//   round.chooseLaw(0);
//   round.startLawVoting(["p1", "p2", "p3", "p4", "p5", "p6"]);

//   round.voteForLaw("p1", true);
//   round.voteForLaw("p2", true);
//   round.voteForLaw("p3", false);
//   round.voteForLaw("p4", false);
//   round.voteForLaw("p5", false);
//   round.voteForLaw("p6", false);

//   const [, approvedLaw] = round.endLawVoting();

//   expect(approvedLaw).toBeNull();
// });
