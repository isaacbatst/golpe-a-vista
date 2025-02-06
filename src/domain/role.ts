// 🏛️ Facções e Papéis
export enum Faction {
  PROGRESSISTAS = "Progressistas",
  CONSERVADORES = "Conservadores"
}

export enum Role {
  RADICAL = "Radical",
  MODERADO = "Moderado",
  CONSERVADOR = "Conservador"
}

export const factionRoles: Record<Faction, Set<Role>> = {
  [Faction.PROGRESSISTAS]: new Set([Role.RADICAL, Role.MODERADO]),
  [Faction.CONSERVADORES]: new Set([Role.CONSERVADOR])
};
  