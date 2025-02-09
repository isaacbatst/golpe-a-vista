import { describe, expect, it } from "vitest";
import { ImpeachmentAction, ImpeachmentStage } from "./impeachment-stage";
import { Player } from "../player";
import { Role } from "../role";
import { Stage } from "./stage";

describe("Estágio de Cassação", () => {
  it("deve escolher o alvo", () => {
    const stage = new ImpeachmentStage(new Player("p1", Role.MODERADO));

    stage.chooseTarget(new Player("p2", Role.MODERADO));
    expect(stage.target).toBeDefined();
  });

  it("deve realizar cassação por votação", () => {
    const stage = new ImpeachmentStage(new Player("p1", Role.MODERADO));

    expect(stage.currentAction).toBe(ImpeachmentAction.SELECT_TARGET);
    const [chooseTargetError] = stage.chooseTarget(
      new Player("p2", Role.MODERADO)
    );
    expect(chooseTargetError).toBeUndefined();
    expect(stage.currentAction).toBe(ImpeachmentAction.START_VOTING);
    const [startVotingError] = stage.startVoting(["p1", "p2"]);
    expect(startVotingError).toBeUndefined();
    expect(stage.currentAction).toBe(ImpeachmentAction.VOTING);
    const [voteError1] = stage.vote("p1", true);
    expect(voteError1).toBeUndefined();
    const [voteError2] = stage.vote("p2", true);
    expect(voteError2).toBeUndefined();
    const [endVotingError] = stage.endVoting();
    expect(endVotingError).toBeUndefined();
    expect(stage.currentAction).toBe(ImpeachmentAction.EXECUTION);
    const [error] = stage.impeach();
    expect(error).toBeUndefined();
    expect(stage.target!.impeached).toBe(true);
  });

  it("deve permitir pular votação um conservador já tiver sido cassado, o alvo for um conservador e o radical ainda não tenha sido cassado", () => {
    const stage = new ImpeachmentStage(new Player("p1", Role.MODERADO), true);

    stage.chooseTarget(new Player("p2", Role.CONSERVADOR));
    expect(stage.shouldSkipVoting).toBe(true);

    const [error] = stage.impeach();
    expect(error).toBeUndefined();
  });

  it("não deve permitir iniciar votação se ela deve ser pulada", () => {
    const stage = new ImpeachmentStage(new Player("p1", Role.MODERADO), true);

    stage.chooseTarget(new Player("p2", Role.CONSERVADOR));
    expect(stage.shouldSkipVoting).toBe(true);

    const [error] = stage.startVoting(["p1", "p2"]);
    expect(error).toBe(
      Stage.unexpectedActionMessage(
        ImpeachmentAction.START_VOTING,
        ImpeachmentAction.EXECUTION
      )
    );
  });
});
// describe("Cassação", () => {
//   it("deve realizar votação de cassação", () => {
//     const round = new Round({
//       president: new Player("p1", Role.RADICAL),
//       lawsDeck: makeLawsDeck(),
//       crisesDeck: makeCrisesDeck(),
//       hasImpeachment: true,
//     });

//     const target = new Player("p2", Role.MODERADO);
//     const [error] = round.startImpeachment(target);
//     expect(error).toBeUndefined();
//     expect(round.impeachment).toBeDefined();
//     const [startVotingError] = round.startImpeachmentVoting(["p1", "p2"]);
//     expect(startVotingError).toBeUndefined();
//     round.voteForImpeachment("p1", true);
//     round.voteForImpeachment("p2", true);
//     expect(round.impeachmentVotingCount).toEqual({
//       yes: 2,
//       no: 0,
//       abstention: 0,
//     });
//   })
// });
