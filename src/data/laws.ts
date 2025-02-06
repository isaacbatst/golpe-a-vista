import { Faction } from "../domain/role";

export type LawType = Faction.PROGRESSISTAS | Faction.CONSERVADORES | 'neutra';

export interface Law {
  name: string;
  type: Faction;
  description: string;
}

export const LAWS: Law[] = [
  {
    name: 'Taxação das Grandes Fortunas',
    type: Faction.PROGRESSISTAS,
    description: 'A próxima lei conservadora aprovada não terá efeito, pois "o orçamento já está equilibrado".',
  },
  {
    name: 'Direito à Greve Sem Retaliação',
    type: Faction.PROGRESSISTAS,
    description: 'Se esta lei for rejeitada, os jogadores não poderão rejeitar a próxima lei, pois "a pressão popular aumentou".',
  },
  {
    name: 'Transparência Total nas Decisões de Governo',
    type: Faction.PROGRESSISTAS,
    description: 'O próximo Presidente deve revelar as duas leis antes de escolher, pois "a população exige mais clareza".',
  },
  {
    name: 'Redução da Jornada de Trabalho: Viva o Ócio!',
    type: Faction.PROGRESSISTAS,
    description: 'O próximo moderado não terá receio de ativar uma crise, pois "o apoio popular está alto".',
  },
  {
    name: 'Fim da Polícia Militar: Segurança Cidadã',
    type: Faction.PROGRESSISTAS,
    description: 'O próximo Presidente não poderá ativar crises, pois "a nova política de segurança pública impede manobras arbitrárias".',
  },
  {
    name: 'Voto de Confiança',
    type: Faction.CONSERVADORES,
    description: 'Se esta lei for aprovada, os jogadores devem votar secretamente na próxima rodada, pois "a estabilidade governamental está em jogo".',
  },
  {
    name: 'Programa de Renda Básica Universal',
    type: Faction.PROGRESSISTAS,
    description: 'Se esta lei for aprovada, o próximo Presidente poderá aprovar uma lei sem votação, pois "o apoio popular garante legitimidade imediata".',
  },
  {
    name: 'Reforma Agrária: Agora Vai!',
    type: Faction.PROGRESSISTAS,
    description: 'Se esta lei for aprovada, os conservadores só poderão ativar crises após duas rodadas, pois "o campo se organizou contra sabotagens".',
  },
  {
    name: 'Privatização da Saúde: Saúde para Quem Pode Pagar',
    type: Faction.CONSERVADORES,
    description: 'O próximo Presidente não poderá escolher leis progressistas, pois "o setor privado exige segurança nos investimentos".',
  },
  {
    name: 'Criminalização de Movimentos Sociais',
    type: Faction.CONSERVADORES,
    description: 'Se esta lei for aprovada, o próximo Presidente será escolhido pelos conservadores, pois "novas diretrizes de ordem pública exigem liderança firme".',
  },
  {
    name: 'Crescimento Econômico Acima de Tudo',
    type: Faction.CONSERVADORES,
    description: 'Se esta lei for aprovada, o próximo Presidente não poderá rejeitar uma lei, independentemente da votação, pois "o governo precisa garantir estabilidade para o mercado".',
  },
  {
    name: 'Aumento de Benefícios Empresariais',
    type: Faction.CONSERVADORES,
    description: 'Se esta lei for rejeitada, os conservadores poderão ativar uma crise imediatamente, pois "o setor privado reage negativamente".',
  },
  {
    name: 'Benefícios Fiscais para Multinacionais',
    type: Faction.CONSERVADORES,
    description: 'Se esta lei for aprovada, a próxima lei progressista obrigatoriamente ativará uma crise, pois "investidores reagem ao risco político".',
  },
  {
    name: 'Orçamento de Guerra: Corte de Gastos Sociais',
    type: Faction.CONSERVADORES,
    description: 'Se esta lei for aprovada, o próximo moderado a assumir o cargo será forçado a ativar uma crise caso escolha uma lei progressista.',
  },
  {
    name: 'Medidas de Estabilização do Congresso',
    type: Faction.CONSERVADORES,
    description: 'Se esta lei for aprovada, os moderados não poderão rejeitar leis na próxima rodada, pois "a governabilidade exige compromisso institucional".',
  },
  {
    name: 'Controle Centralizado',
    type: Faction.CONSERVADORES,
    description: 'O próximo Presidente não poderá votar na próxima rodada, pois "a administração pública deve ser gerida tecnocraticamente".',
  },
  {
    name: 'Redução do Tamanho do Estado',
    type: Faction.CONSERVADORES,
    description: 'Se esta lei for aprovada, o próximo Presidente sacará apenas uma lei em vez de duas, pois "a máquina pública foi enxugada".',
  },
];
