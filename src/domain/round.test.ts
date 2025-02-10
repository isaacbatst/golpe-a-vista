import { describe, expect, it } from "vitest";
import { Crisis, CrisisVisibleTo } from "./crisis/crisis";
import { Player } from "./player";
import { LawType, Role } from "./role";
import { Round } from "./round";
import { DossierAction, DossierStage } from "./stage/dossier-stage";
import { ImpeachmentAction, ImpeachmentStage } from "./stage/impeachment-stage";
import { LegislativeAction, LegislativeStage } from "./stage/legislative-stage";
import { RadicalizationStage } from "./stage/radicalization-stage";
import { SabotageAction, SabotageStage } from "./stage/sabotage-stage";
import { makeCrisesDeck, makeLawsDeck } from "./deck-factory";

describe("Round", () => {
  it("Deve iniciar Estágio Legislativo", () => {
    const president = new Player("p1", Role.MODERADO);
    const nextPresident = new Player("p2", Role.MODERADO);
    const lawsDeck = makeLawsDeck();
    const crisesDeck = makeCrisesDeck();
    const round = new Round({ president, nextPresident, lawsDeck, crisesDeck });
    expect(round.currentStage).toBeInstanceOf(LegislativeStage);
  });

  it("Deve iniciar com Cassação caso esteja ativa nesta rodada", () => {
    const president = new Player("p1", Role.MODERADO);
    const nextPresident = new Player("p2", Role.MODERADO);
    const lawsDeck = makeLawsDeck();
    const crisesDeck = makeCrisesDeck();
    const round = new Round({
      president,
      nextPresident,
      lawsDeck,
      crisesDeck,
      hasImpeachment: true,
    });
    expect(round.currentStage).toBeInstanceOf(ImpeachmentStage);
  });

  it("Deve avançar de cassação para legislativo", () => {
    const president = new Player("p1", Role.MODERADO);
    const nextPresident = new Player("p2", Role.MODERADO);
    const lawsDeck = makeLawsDeck();
    const crisesDeck = makeCrisesDeck();
    const round = new Round({
      president,
      nextPresident,
      lawsDeck,
      crisesDeck,
      stages: [
        new ImpeachmentStage(
          president,
          false,
          false,
          ImpeachmentAction.ADVANCE_STAGE
        ),
      ],
      hasImpeachment: true,
    });
    const [error, stage] = round.nextStage();
    expect(error).toBeUndefined();
    expect(stage).toBeInstanceOf(LegislativeStage);
  });

  it("Não deve avançar para o Dossiê sem finalizar o Estágio Legislativo", () => {
    const president = new Player("p1", Role.MODERADO);
    const nextPresident = new Player("p2", Role.MODERADO);
    const lawsDeck = makeLawsDeck();
    const crisesDeck = makeCrisesDeck();
    const round = new Round({ president, nextPresident, lawsDeck, crisesDeck });
    const [error] = round.nextStage();
    expect(error).toBe("Estágio atual não finalizado");
  });

  it("Deve avançar para o estágio do Dossiê", () => {
    const president = new Player("p1", Role.MODERADO);
    const nextPresident = new Player("p2", Role.MODERADO);
    const lawsDeck = makeLawsDeck();
    const crisesDeck = makeCrisesDeck();
    const round = new Round({
      president,
      nextPresident,
      lawsDeck,
      crisesDeck,
      stages: [new LegislativeStage(lawsDeck, LegislativeAction.ADVANCE_STAGE)],
    });
    const [error, stage] = round.nextStage();
    expect(error).toBeUndefined();
    expect(stage).toBeInstanceOf(DossierStage);
  });

  it("Deve finalizar round após o dossiê", () => {
    const president = new Player("p1", Role.MODERADO);
    const nextPresident = new Player("p2", Role.MODERADO);
    const lawsDeck = makeLawsDeck();
    const crisesDeck = makeCrisesDeck();
    const round = new Round({
      president,
      nextPresident,
      lawsDeck,
      crisesDeck,
      stages: [
        new DossierStage(
          president,
          nextPresident,
          null,
          DossierAction.ADVANCE_STAGE
        ),
      ],
    });
    const [error, stage] = round.nextStage();
    expect(error).toBeUndefined();
    expect(stage).toBeNull();
    expect(round.finished).toBe(true);
  });

  it("Deve avançar do Dossiê para o estágio da Sabotagem se uma lei progressista foi aprovada e a rodada anterior não foi sabotada", () => {
    const president = new Player("p1", Role.MODERADO);
    const nextPresident = new Player("p2", Role.MODERADO);
    const lawsDeck = makeLawsDeck(
      Array.from({ length: 5 }, (_, i) => ({
        description: `Lei ${i + 1}`,
        type: LawType.PROGRESSISTAS,
        name: `L${i + 1}`,
      }))
    );
    const crisesDeck = makeCrisesDeck();
    const players = ["p1", "p2", "p3", "p4", "p5", "p6"];
    const legislativeStage = new LegislativeStage(lawsDeck);
    const [drawLawsError] = legislativeStage.drawLaws();
    expect(drawLawsError).toBeUndefined();
    const [vetoLawError] = legislativeStage.vetoLaw(0);
    expect(vetoLawError).toBeUndefined();
    const [chooseLawForVotingError] = legislativeStage.chooseLawForVoting(1);
    expect(chooseLawForVotingError).toBeUndefined();
    const [startVotingError] = legislativeStage.startVoting(players);
    expect(startVotingError).toBeUndefined();
    for (const player of players) {
      const [error] = legislativeStage.vote(player, true);
      expect(error).toBeUndefined();
    }
    expect(legislativeStage.votingResult).toBe(true);
    const round = new Round({
      president,
      nextPresident,
      lawsDeck,
      crisesDeck,
      stages: [
        legislativeStage,
        new DossierStage(
          president,
          nextPresident,
          null,
          DossierAction.ADVANCE_STAGE
        ),
      ],
      hasLastRoundBeenSabotaged: false,
    });
    const [error, stage] = round.nextStage();
    expect(error).toBeUndefined();
    expect(stage).toBeInstanceOf(SabotageStage);
  });

  it("Deve avançar do Dossiê para o estágio de Radicalização se não houver Sabotagem, pelo menos X leis progressistas ou Y leis conservadoras foram ativadas e a rodada atual tiver uma crise", () => {
    const president = new Player("p1", Role.MODERADO);
    const nextPresident = new Player("p2", Role.MODERADO);
    const lawsDeck = makeLawsDeck(
      Array.from({ length: 5 }, (_, i) => ({
        description: `Lei ${i + 1}`,
        type: LawType.PROGRESSISTAS,
        name: `L${i + 1}`,
      }))
    );
    const crisesDeck = makeCrisesDeck();
    const round = new Round({
      president,
      nextPresident,
      lawsDeck,
      crisesDeck,
      minRadicalizationConservativeLaws: 2,
      minRadicalizationProgressiveLaws: 2,
      previouslyApprovedConservativeLaws: 2,
      previouslyApprovedProgressiveLaws: 2,
      crisis: new Crisis(["Crise 1"], "Descrição da crise", [CrisisVisibleTo.ALL]),
      stages: [
        new LegislativeStage(lawsDeck, LegislativeAction.ADVANCE_STAGE),
        new DossierStage(
          president,
          nextPresident,
          null,
          DossierAction.ADVANCE_STAGE
        ),
      ],
    });
    const [error, stage] = round.nextStage();
    expect(error).toBeUndefined();
    expect(stage).toBeInstanceOf(RadicalizationStage);
  });

  it("Deve avançar do estágio de Sabotagem para o estágio de Radicalização se a rodada anterior foi sabotada e cumprir as condições de radicalização", () => {
    const president = new Player("p1", Role.MODERADO);
    const nextPresident = new Player("p2", Role.MODERADO);
    const lawsDeck = makeLawsDeck(
      Array.from({ length: 5 }, (_, i) => ({
        description: `Lei ${i + 1}`,
        type: LawType.PROGRESSISTAS,
        name: `L${i + 1}`,
      }))
    );
    const crisesDeck = makeCrisesDeck();
    const round = new Round({
      president,
      nextPresident,
      lawsDeck,
      crisesDeck,
      minRadicalizationConservativeLaws: 2,
      minRadicalizationProgressiveLaws: 2,
      previouslyApprovedConservativeLaws: 2,
      previouslyApprovedProgressiveLaws: 2,
      crisis: new Crisis(["Crise 1"], "Descrição da crise", [CrisisVisibleTo.ALL]),
      stages: [new SabotageStage(crisesDeck, SabotageAction.ADVANCE_STAGE)],
      hasLastRoundBeenSabotaged: true,
    });
    const [error, stage] = round.nextStage();
    expect(error).toBeUndefined();
    expect(stage).toBeInstanceOf(RadicalizationStage);
  });
});
