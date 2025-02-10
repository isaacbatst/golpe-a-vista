import { describe, expect, it } from "vitest";
import CRISES from "../../data/crises";
import { ActionController } from "../action-controller";
import { PlanoCohen } from "../crisis/plano-cohen";
import { Deck } from "../deck";
import { SabotageAction, SabotageStage } from "./sabotage-stage";

const makeCrisesDeck = () => {
  const [error, deck] = Deck.create(
    Object.values(CRISES).map(() => new PlanoCohen())
  );
  if (!deck) {
    throw new Error(error);
  }
  return deck;
};

describe("Estágio de Sabotagem", () => {
  it("deve sacar crises e escolher uma", () => {
    const stage = new SabotageStage(makeCrisesDeck());
    const [drawCrisesError] = stage.drawCrises();
    expect(drawCrisesError).toBeUndefined();
    expect(stage.drawnCrises).toBeDefined();
    const [chooseCrisisError] = stage.chooseSabotageCrisis(0);
    expect(chooseCrisisError).toBeUndefined();
  });

  it("não deve escolher uma crise sem sacar", () => {
    const stage = new SabotageStage(makeCrisesDeck());
    const [chooseCrisisError] = stage.chooseSabotageCrisis(0);
    expect(chooseCrisisError).toBe(
      ActionController.unexpectedActionMessage(
        SabotageAction.CHOOSE_CRISIS,
        SabotageAction.DRAW_CRISIS
      )
    );
  });
});
