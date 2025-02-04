// 🏛️ Facções e Papéis
export enum Faction {
  PROGRESSISTAS = "Progressistas",
  GOLPISTAS = "Golpistas"
}

export enum Role {
  RADICAL = "Radical",
  MODERADO = "Moderado",
  CONSERVADOR = "Conservador"
}

export const factionRoles: Record<Faction, Set<Role>> = {
  [Faction.PROGRESSISTAS]: new Set([Role.RADICAL, Role.MODERADO]),
  [Faction.GOLPISTAS]: new Set([Role.CONSERVADOR])
};
  