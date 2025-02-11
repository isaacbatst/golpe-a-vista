import { CafeComAbin } from './cafe-com-abin';
import { Crisis } from './crisis';
import { CRISIS_NAMES } from './crisis-names';
import { FmiMandou } from './fmi-mandou';
import { ForcasOcultas } from './forcas-ocultas';
import { GolpeDeEstado } from './golpe-de-estado';
import { PlanoCohen } from './plano-cohen';
import { SessaoSecreta } from './sessao-secreta';

export class CrisisFactory {
  static createCrisis(name: CRISIS_NAMES) {
    const map: Record<CRISIS_NAMES, () => Crisis> = {
      [CRISIS_NAMES.FORCAS_OCULTAS]: () => new ForcasOcultas(),
      [CRISIS_NAMES.O_FMI_MANDOU]: () => new FmiMandou(),
      [CRISIS_NAMES.PLANO_COHEN]: () => new PlanoCohen(),
      [CRISIS_NAMES.SESSAO_SECRETA]: () => new SessaoSecreta(),
      [CRISIS_NAMES.CAFE_COM_A_ABIN]: () => new CafeComAbin(),
      [CRISIS_NAMES.GOLPE_DE_ESTADO]: () => new GolpeDeEstado(),
    };

    return map[name]();
  }
}
