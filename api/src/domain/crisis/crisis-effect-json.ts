import { CafeComAbin } from 'src/domain/crisis/cafe-com-abin';
import { CongressoTrancado } from 'src/domain/crisis/congresso-trancado';
import { FmiMandou } from 'src/domain/crisis/fmi-mandou';
import { ForcasOcultas } from 'src/domain/crisis/forcas-ocultas';
import { GolpeDeEstado } from 'src/domain/crisis/golpe-de-estado';
import { Mensalao } from 'src/domain/crisis/mensalao';
import { PegadinhaDoParagrafo } from 'src/domain/crisis/pegadinha-do-paragrafo';
import { PlanoCohen } from 'src/domain/crisis/plano-cohen';
import { SessaoSecreta } from 'src/domain/crisis/sessao-secreta';
import { VetoStf } from 'src/domain/crisis/veto-stf';

type ToJson<T extends { toJSON: any }> = ReturnType<T['toJSON']>;
export type CrisisEffectJSON =
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
