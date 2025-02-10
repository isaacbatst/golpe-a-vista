import CRISES from "../../data/crises";
import { Crisis } from "./crisis";

export class FmiMandouCrisis extends Crisis {
  constructor(){
    super({
      description: CRISES.O_FMI_MANDOU.description,
      titles: CRISES.O_FMI_MANDOU.titles,
      visibleTo: CRISES.O_FMI_MANDOU.visibleTo,
      notVisibleTo: CRISES.O_FMI_MANDOU.notVisibleTo,
    })
  }
}