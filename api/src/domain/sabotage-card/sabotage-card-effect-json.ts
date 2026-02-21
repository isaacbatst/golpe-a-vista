import { CafeComAbin } from 'src/domain/sabotage-card/cafe-com-abin';
import { CongressoTrancado } from 'src/domain/sabotage-card/congresso-trancado';
import { FmiMandou } from 'src/domain/sabotage-card/fmi-mandou';
import { ForcasOcultas } from 'src/domain/sabotage-card/forcas-ocultas';
import { GolpeDeEstado } from 'src/domain/sabotage-card/golpe-de-estado';
import { Mensalao } from 'src/domain/sabotage-card/mensalao';
import { PegadinhaDoParagrafo } from 'src/domain/sabotage-card/pegadinha-do-paragrafo';
import { PlanoCohen } from 'src/domain/sabotage-card/plano-cohen';
import { SessaoSecreta } from 'src/domain/sabotage-card/sessao-secreta';
import { VetoStf } from 'src/domain/sabotage-card/veto-stf';

type ToJson<T extends { toJSON: any }> = ReturnType<T['toJSON']>;
export type SabotageCardEffectJSON =
  | ToJson<CafeComAbin>
  | ToJson<SessaoSecreta>
  | ToJson<PlanoCohen>
  | ToJson<ForcasOcultas>
  | ToJson<FmiMandou>
  | ToJson<Mensalao>
  | ToJson<GolpeDeEstado>
  | ToJson<CongressoTrancado>
  | ToJson<PegadinhaDoParagrafo>
  | ToJson<VetoStf>;
