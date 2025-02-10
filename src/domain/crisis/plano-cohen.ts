import CRISES from "../../data/crises";
import { Round } from "../round";
import { Crisis } from "./crisis";

export class PlanoCohen extends Crisis {
  constructor(){
    super({
      description: CRISES.PLANO_COHEN.description,
      titles: CRISES.PLANO_COHEN.titles,
      visibleTo: CRISES.PLANO_COHEN.visibleTo,
      notVisibleTo: CRISES.PLANO_COHEN.notVisibleTo,
    });
  }

  effect(round: Round): void {
    round.isDossierFake = true;
  }
}