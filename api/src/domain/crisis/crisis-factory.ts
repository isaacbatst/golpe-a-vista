import { CafeComAbin } from './cafe-com-abin';
import { Crisis, CrisisJSON, CrisisParams } from './crisis';
import { CRISIS_NAMES } from './crisis-names';
import { FmiMandou } from './fmi-mandou';
import { ForcasOcultas } from './forcas-ocultas';
import { GolpeDeEstado } from './golpe-de-estado';
import { PlanoCohen } from './plano-cohen';
import { SessaoSecreta } from './sessao-secreta';

type RequireName = Partial<Omit<CrisisParams, 'name'>> &
  Pick<CrisisParams, 'name'>;

export class CrisisFactory {
  static create(params: RequireName): Crisis {
    const map: Record<CRISIS_NAMES, () => Crisis> = {
      [CRISIS_NAMES.FORCAS_OCULTAS]: () => new ForcasOcultas(params),
      [CRISIS_NAMES.O_FMI_MANDOU]: () => new FmiMandou(params),
      [CRISIS_NAMES.PLANO_COHEN]: () => new PlanoCohen(params),
      [CRISIS_NAMES.SESSAO_SECRETA]: () => new SessaoSecreta(params),
      [CRISIS_NAMES.CAFE_COM_A_ABIN]: () => new CafeComAbin(params),
      [CRISIS_NAMES.GOLPE_DE_ESTADO]: () => new GolpeDeEstado(params),
    };

    return map[params.name]();
  }

  static fromJSON(json: CrisisJSON): Crisis {
    return CrisisFactory.create({
      name: json.title as CRISIS_NAMES,
      description: json.description,
      visibleTo: json.visibleTo,
      notVisibleTo: json.notVisibleTo,
      currentAction: json.currentAction ?? undefined,
      actions: json.actions ?? undefined,
      title: json.title,
      titles: json.titles,
    });
  }
}
