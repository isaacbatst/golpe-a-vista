import { CafeComAbin } from 'src/domain/crisis/cafe-com-abin';
import { CrisisEffect } from 'src/domain/crisis/crisis-effect';
import { CRISIS_NAMES } from 'src/domain/crisis/crisis-names';
import { FmiMandou } from 'src/domain/crisis/fmi-mandou';
import { ForcasOcultas } from 'src/domain/crisis/forcas-ocultas';
import { Mensalao } from 'src/domain/crisis/mensalao';
import { PlanoCohen } from 'src/domain/crisis/plano-cohen';
import { SessaoSecreta } from 'src/domain/crisis/sessao-secreta';

export class CrisisEffectFactory {
  static create(crisis: CRISIS_NAMES): CrisisEffect {
    switch (crisis) {
      case CRISIS_NAMES.CAFE_COM_A_ABIN:
        return new CafeComAbin();
      case CRISIS_NAMES.SESSAO_SECRETA:
        return new SessaoSecreta();
      case CRISIS_NAMES.PLANO_COHEN:
        return new PlanoCohen();
      case CRISIS_NAMES.FORCAS_OCULTAS:
        return new ForcasOcultas();
      case CRISIS_NAMES.O_FMI_MANDOU:
        return new FmiMandou();
      case CRISIS_NAMES.MENSALAO:
        return new Mensalao();
      default:
        throw new Error(`Invalid crisis name: ${crisis}`);
    }
  }

  static fromJSON(data: ReturnType<CrisisEffect['toJSON']>) {
    switch (data.crisis) {
      case CRISIS_NAMES.CAFE_COM_A_ABIN:
        return CafeComAbin.fromJSON(data);
      case CRISIS_NAMES.SESSAO_SECRETA:
        return SessaoSecreta.fromJSON(data);
      case CRISIS_NAMES.PLANO_COHEN:
        return PlanoCohen.fromJSON(data);
      case CRISIS_NAMES.FORCAS_OCULTAS:
        return ForcasOcultas.fromJSON(data);
      case CRISIS_NAMES.O_FMI_MANDOU:
        return FmiMandou.fromJSON(data);
      default:
        throw new Error(`Invalid crisis name: ${data.crisis}`);
    }
  }
}
