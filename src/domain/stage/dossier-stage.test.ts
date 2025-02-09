import { describe, expect, it } from "vitest";
import { DossierStage } from "./dossier-stage";
import { Player } from "../player";
import { Role } from "../role";

describe("Estágio do Dossiê", () => {
  it("deve escolher o relator da próxima rodada", () => {
    const stage = new DossierStage(
      new Player("p1", Role.MODERADO),
      new Player("p2", Role.MODERADO),
      new Player("p3", Role.MODERADO)
    );

    const nextRapporteur = new Player("p4", Role.MODERADO);

    const [error] = stage.chooseNextRapporteur(nextRapporteur);
    expect(error).toBeUndefined();
    expect(stage.nextRapporteur).toBe(nextRapporteur);
  });

  it("não deve permitir que o relator da próxima rodada seja o presidente atual", () => {
    const president = new Player("p1", Role.MODERADO);
    const stage = new DossierStage(
      president,
      new Player("p2", Role.MODERADO),
      new Player("p3", Role.MODERADO)
    );

    const [error] = stage.chooseNextRapporteur(president);
    expect(error).toBe("O presidente não pode ser o próximo relator");
  });

  it("não deve permitir que o relator da próxima rodada seja o relator atual", () => {
    const currentRapporteur = new Player("p3", Role.MODERADO);
    const stage = new DossierStage(
      new Player("p1", Role.MODERADO),
      new Player("p2", Role.MODERADO),
      currentRapporteur
    );

    const [error] = stage.chooseNextRapporteur(currentRapporteur);
    expect(error).toBe("O relator anterior não pode ser o relator");
  });

  it("não deve permitir que o relator da próxima rodada seja o próximo presidente", () => {
    const nextPresident = new Player("p2", Role.MODERADO);
    const stage = new DossierStage(
      new Player("p1", Role.MODERADO),
      nextPresident,
      new Player("p3", Role.MODERADO)
    );

    const [error] = stage.chooseNextRapporteur(nextPresident);
    expect(error).toBe("O próximo presidente não pode ser o relator");
  });

  it("não deve permitir que o relator da próxima rodada tenha sido cassado", () => {
    const impeachedRapporteur = new Player("p3", Role.MODERADO, true);
    const stage = new DossierStage(
      new Player("p1", Role.MODERADO),
      new Player("p2", Role.MODERADO),
      new Player("p4", Role.MODERADO)
    );

    const [error] = stage.chooseNextRapporteur(impeachedRapporteur);
    expect(error).toBe("O relator não pode ter sido cassado");
  });

  it("deve passar o dossiê para o relator", () => {
    const stage = new DossierStage(
      new Player("p1", Role.MODERADO),
      new Player("p2", Role.MODERADO),
      new Player("p3", Role.MODERADO)
    );

    stage.chooseNextRapporteur(new Player("p4", Role.MODERADO));
    const [error] = stage.passDossier();
    expect(error).toBeUndefined();
    expect(stage.isDossierVisibleToRapporteur).toBe(true);
  });
});
