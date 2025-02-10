import CRISES from "../data/crises";
import { Crisis } from "./crisis/crisis";
import { Deck } from "./deck";
import { Law } from "../data/laws";
import { LawType } from "./role";

export const makeCrisesDeck = () => {
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

export const makeLawsDeck = (
  laws: Law[] |
  "progressive" |
  "conservative" = [
    { description: "Lei 1", type: LawType.CONSERVADORES, name: "L1" },
    { description: "Lei 2", type: LawType.CONSERVADORES, name: "L2" },
    { description: "Lei 3", type: LawType.CONSERVADORES, name: "L3" },
    { description: "Lei 4", type: LawType.CONSERVADORES, name: "L4" },
  ] 
) => {
  if (laws === "progressive") {
    laws = Array.from({ length: 5 }, (_, i) => ({
      description: `Lei ${i + 1}`,
      type: LawType.PROGRESSISTAS,
      name: `L${i + 1}`,
    }));
  }
  if (laws === "conservative") {
    laws = Array.from({ length: 5 }, (_, i) => ({
      description: `Lei ${i + 1}`,
      type: LawType.CONSERVADORES,
      name: `L${i + 1}`,
    }));
  }

  const [error, deck] = Deck.create(laws);
  if (!deck) {
    throw new Error(error);
  }
  return deck;
};
