import { LawType } from '../domain/role';

export class Law {
  readonly cardType = 'LAW';

  constructor(
    readonly name: string,
    readonly type: LawType,
    readonly description: string,
  ) {}
  toJSON() {
    return {
      name: this.name,
      type: this.type,
      description: this.description,
    };
  }
  static fromJSON(data: { name: string; type: LawType; description: string }) {
    return new Law(data.name, data.type, data.description);
  }
}

export const LAWS: Law[] = [
  new Law(
    'Taxação das Grandes Fortunas',
    LawType.PROGRESSISTAS,
    'A próxima lei conservadora aprovada não terá efeito, pois "o orçamento já está equilibrado".',
  ),
  new Law(
    'Direito à Greve Sem Retaliação',
    LawType.PROGRESSISTAS,
    'Se esta lei for rejeitada, os jogadores não poderão rejeitar a próxima lei, pois "a pressão popular aumentou".',
  ),
  new Law(
    'Transparência Total nas Decisões de Governo',
    LawType.PROGRESSISTAS,
    'O próximo Presidente deve revelar as duas leis antes de escolher, pois "a população exige mais clareza".',
  ),
  new Law(
    'Redução da Jornada de Trabalho: Viva o Ócio!',
    LawType.PROGRESSISTAS,
    'O próximo moderado não terá receio de ativar uma crise, pois "o apoio popular está alto".',
  ),
  new Law(
    'Fim da Polícia Militar: Segurança Cidadã',
    LawType.PROGRESSISTAS,
    'O próximo Presidente não poderá ativar crises, pois "a nova política de segurança pública impede manobras arbitrárias".',
  ),
  new Law(
    'Voto de Confiança',
    LawType.CONSERVADORES,
    'Se esta lei for aprovada, os jogadores devem votar secretamente na próxima rodada, pois "a estabilidade governamental está em jogo".',
  ),
  new Law(
    'Programa de Renda Básica Universal',
    LawType.PROGRESSISTAS,
    'Se esta lei for aprovada, o próximo Presidente poderá aprovar uma lei sem votação, pois "o apoio popular garante legitimidade imediata".',
  ),
  new Law(
    'Reforma Agrária: Agora Vai!',
    LawType.PROGRESSISTAS,
    'Se esta lei for aprovada, os conservadores só poderão ativar crises após duas rodadas, pois "o campo se organizou contra sabotagens".',
  ),
  new Law(
    'Privatização da Saúde: Saúde para Quem Pode Pagar',
    LawType.CONSERVADORES,
    'O próximo Presidente não poderá escolher leis progressistas, pois "o setor privado exige segurança nos investimentos".',
  ),
  new Law(
    'Criminalização de Movimentos Sociais',
    LawType.CONSERVADORES,
    'Se esta lei for aprovada, o próximo Presidente será escolhido pelos conservadores, pois "novas diretrizes de ordem pública exigem liderança firme".',
  ),
  new Law(
    'Crescimento Econômico Acima de Tudo',
    LawType.CONSERVADORES,
    'Se esta lei for aprovada, o próximo Presidente não poderá rejeitar uma lei, independentemente da votação, pois "o governo precisa garantir estabilidade para o mercado".',
  ),
  new Law(
    'Aumento de Benefícios Empresariais',
    LawType.CONSERVADORES,
    'Se esta lei for rejeitada, os conservadores poderão ativar uma crise imediatamente, pois "o setor privado reage negativamente".',
  ),
  new Law(
    'Benefícios Fiscais para Multinacionais',
    LawType.CONSERVADORES,
    'Se esta lei for aprovada, a próxima lei progressista obrigatoriamente ativará uma crise, pois "investidores reagem ao risco político".',
  ),
  new Law(
    'Orçamento de Guerra: Corte de Gastos Sociais',
    LawType.CONSERVADORES,
    'Se esta lei for aprovada, o próximo moderado a assumir o cargo será forçado a ativar uma crise caso escolha uma lei progressista.',
  ),
  new Law(
    'Medidas de Estabilização do Congresso',
    LawType.CONSERVADORES,
    'Se esta lei for aprovada, os moderados não poderão rejeitar leis na próxima rodada, pois "a governabilidade exige compromisso institucional".',
  ),
  new Law(
    'Controle Centralizado',
    LawType.CONSERVADORES,
    'O próximo Presidente não poderá votar na próxima rodada, pois "a administração pública deve ser gerida tecnocraticamente".',
  ),
  new Law(
    'Redução do Tamanho do Estado',
    LawType.CONSERVADORES,
    'Se esta lei for aprovada, o próximo Presidente sacará apenas uma lei em vez de duas, pois "a máquina pública foi enxugada".',
  ),
];
