import { CafeComAbin } from 'src/domain/sabotage-card/cafe-com-abin';
import { CongressoTrancado } from 'src/domain/sabotage-card/congresso-trancado';
import { SabotageCardEffect } from 'src/domain/sabotage-card/sabotage-card-effect';
import { SabotageCardEffectJSON } from 'src/domain/sabotage-card/sabotage-card-effect-json';
import { SABOTAGE_CARD_NAMES } from 'src/domain/sabotage-card/sabotage-card-names';
import { FmiMandou } from 'src/domain/sabotage-card/fmi-mandou';
import { ForcasOcultas } from 'src/domain/sabotage-card/forcas-ocultas';
import { GolpeDeEstado } from 'src/domain/sabotage-card/golpe-de-estado';
import { Mensalao } from 'src/domain/sabotage-card/mensalao';
import { PegadinhaDoParagrafo } from 'src/domain/sabotage-card/pegadinha-do-paragrafo';
import { PlanoCohen } from 'src/domain/sabotage-card/plano-cohen';
import { SessaoSecreta } from 'src/domain/sabotage-card/sessao-secreta';
import { VetoStf } from 'src/domain/sabotage-card/veto-stf';

export class SabotageCardEffectFactory {
  static create(sabotageCardName: SABOTAGE_CARD_NAMES): SabotageCardEffect {
    switch (sabotageCardName) {
      case SABOTAGE_CARD_NAMES.CAFE_COM_A_ABIN:
        return new CafeComAbin();
      case SABOTAGE_CARD_NAMES.SESSAO_SECRETA:
        return new SessaoSecreta();
      case SABOTAGE_CARD_NAMES.PLANO_COHEN:
        return new PlanoCohen();
      case SABOTAGE_CARD_NAMES.FORCAS_OCULTAS:
        return new ForcasOcultas();
      case SABOTAGE_CARD_NAMES.O_FMI_MANDOU:
        return new FmiMandou();
      case SABOTAGE_CARD_NAMES.MENSALAO:
        return new Mensalao();
      case SABOTAGE_CARD_NAMES.GOLPE_DE_ESTADO:
        return new GolpeDeEstado();
      case SABOTAGE_CARD_NAMES.CONGRESSO_TRANCADO:
        return new CongressoTrancado();
      case SABOTAGE_CARD_NAMES.PEGADINHA_DO_PARAGRAFO_47_INCISO_V:
        return new PegadinhaDoParagrafo();
      case SABOTAGE_CARD_NAMES.VETO_DO_STF:
        return new VetoStf();
      default:
        throw new Error(`Invalid sabotage card name: ${sabotageCardName as any}`);
    }
  }

  static fromJSON(data: SabotageCardEffectJSON): SabotageCardEffect {
    switch (data.sabotageCard) {
      case SABOTAGE_CARD_NAMES.CAFE_COM_A_ABIN:
        return CafeComAbin.fromJSON(data);
      case SABOTAGE_CARD_NAMES.SESSAO_SECRETA:
        return SessaoSecreta.fromJSON(data);
      case SABOTAGE_CARD_NAMES.PLANO_COHEN:
        return PlanoCohen.fromJSON(data);
      case SABOTAGE_CARD_NAMES.FORCAS_OCULTAS:
        return ForcasOcultas.fromJSON(data);
      case SABOTAGE_CARD_NAMES.O_FMI_MANDOU:
        return FmiMandou.fromJSON(data);
      case SABOTAGE_CARD_NAMES.GOLPE_DE_ESTADO:
        return GolpeDeEstado.fromJSON(data);
      case SABOTAGE_CARD_NAMES.MENSALAO:
        return Mensalao.fromJSON(data);
      case SABOTAGE_CARD_NAMES.CONGRESSO_TRANCADO:
        return CongressoTrancado.fromJSON(data);
      case SABOTAGE_CARD_NAMES.PEGADINHA_DO_PARAGRAFO_47_INCISO_V:
        return PegadinhaDoParagrafo.fromJSON(data);
      case SABOTAGE_CARD_NAMES.VETO_DO_STF:
        return VetoStf.fromJSON(data);
      default:
        throw new Error(
          `Invalid sabotage card name: ${(data as { sabotageCard: string }).sabotageCard}`,
        );
    }
  }
}
