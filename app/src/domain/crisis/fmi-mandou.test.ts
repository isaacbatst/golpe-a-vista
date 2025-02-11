import { describe, expect, it } from "vitest";
import { makeRound } from "../mock";
import { LawType } from "../role";
import { FmiMandou } from "./fmi-mandou";

describe("Café com a Abin", () => {
  it("não deve permitir que o relator veja o dossiê", () => {
    const fmiMandou = new FmiMandou();
    const round = makeRound();
    fmiMandou.effect(round);
    expect(round.requiredVeto).toBe(LawType.PROGRESSISTAS);
  });
});
