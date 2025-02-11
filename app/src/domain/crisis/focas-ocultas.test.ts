import { describe, expect, it } from "vitest";
import { makeRound } from "../mock";
import { LawType } from "../role";
import { ForcasOcultas } from "./forcas-ocultas";

describe("Café com a Abin", () => {
  it("não deve permitir que o relator veja o dossiê", () => {
    const forcasOcultas = new ForcasOcultas();
    const round = makeRound();
    forcasOcultas.effect(round);
    expect(round.requiredVeto).toBe(LawType.PROGRESSISTAS);
  });
});
