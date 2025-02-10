import CRISES from "../../data/crises";
import { Crisis } from "./crisis";

export class ForcasOcultasCrisis extends Crisis {
  constructor(){
    super({
      description: CRISES.FORCAS_OCULTAS.description,
      titles: CRISES.FORCAS_OCULTAS.titles,
      visibleTo: CRISES.FORCAS_OCULTAS.visibleTo,
      notVisibleTo: CRISES.FORCAS_OCULTAS.notVisibleTo,
    })
  }
}