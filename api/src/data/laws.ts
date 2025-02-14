import { LawType } from '../domain/role';

export class Law {
  readonly cardType = 'LAW';

  constructor(
    readonly name: string,
    readonly type: LawType,
    readonly description: string,
    readonly id = '112',
  ) {}
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      description: this.description,
    };
  }
  static fromJSON(data: {
    name: string;
    type: LawType;
    description: string;
    id: string;
  }) {
    return new Law(data.name, data.type, data.description, data.id);
  }
}
export const LAWS: Law[] = [
  new Law(
    'Taxação das Grandes Fortunas',
    LawType.PROGRESSISTAS,
    'Os mais ricos pagando mais impostos? Que ultraje!',
    '112',
  ),
  new Law(
    'Direito à Greve',
    LawType.PROGRESSISTAS,
    'Agora ninguém pode mais ser demitido só por querer direitos básicos.',
    '142',
  ),
  new Law(
    'Transparência Total',
    LawType.PROGRESSISTAS,
    'Os políticos terão que contar tudo. O desespero no Congresso é palpável.',
    '932',
  ),
  new Law(
    'Redução da Jornada de Trabalho',
    LawType.PROGRESSISTAS,
    'Mais tempo livre para a população. O patrão que lute!',
    '215',
  ),
  new Law(
    'Fim da Polícia Militar',
    LawType.PROGRESSISTAS,
    'Agora a segurança pública será feita com base no diálogo e no respeito. Que conceito revolucionário!',
    '348',
  ),
  new Law(
    'Escola sem Política',
    LawType.CONSERVADORES,
    'Professores proibidos de discutir questões sociais e políticas em sala. Melhor garantir que ninguém pense demais!',
    '467',
  ),
  new Law(
    'Renda Básica Universal',
    LawType.PROGRESSISTAS,
    'Dinheiro no bolso do povo sem trabalhar? Tem gente arrancando os cabelos agora mesmo.',
    '529',
  ),
  new Law(
    'Reforma Agrária',
    LawType.PROGRESSISTAS,
    'Mais terra para quem planta. Os latifundiários estão nervosos!',
    '673',
  ),
  new Law(
    'Privatização da Saúde',
    LawType.CONSERVADORES,
    'Saúde para quem pode pagar! SUS é coisa do passado.',
    '784',
  ),
  new Law(
    'Criminalização de Movimentos Sociais',
    LawType.CONSERVADORES,
    'Protestou? Cadeia! Ordem e progresso, mas sem o progresso.',
    '856',
  ),
  new Law(
    'Teto de Gastos',
    LawType.CONSERVADORES,
    'Investir no povo? Melhor congelar tudo e esperar o milagre econômico acontecer.',
    '918',
  ),
  new Law(
    'Benefícios Empresariais',
    LawType.CONSERVADORES,
    'Empresas primeiro, o povo... talvez depois.',
    '371',
  ),
  new Law(
    'Incentivo às Multinacionais',
    LawType.CONSERVADORES,
    'O dinheiro sai, os problemas ficam. Negócio bom assim ninguém nunca viu.',
    '624',
  ),
  new Law(
    'Orçamento de Guerra',
    LawType.CONSERVADORES,
    'Cortar tudo que não seja canhão. Educação? Saúde? Que bobagem!',
    '482',
  ),
  new Law(
    'Estabilização do Congresso',
    LawType.CONSERVADORES,
    'Menos debate, mais obediência. A democracia agradece... ou não.',
    '759',
  ),
  new Law(
    'Controle Centralizado',
    LawType.CONSERVADORES,
    'Agora só um manda e ninguém discute. Democracia simplificada!',
    '890',
  ),
  new Law(
    'Privatização da Educação',
    LawType.CONSERVADORES,
    'A iniciativa privada sabe o que é melhor para o seu filho. O Estado só atrapalha.',
    '503',
  ),
];
