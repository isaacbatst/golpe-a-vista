import { SabotageCardVisibleTo, PlayerDTO } from "@/lib/api.types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isSabotageCardVisible = (
  visibleTo: SabotageCardVisibleTo[],
  player: PlayerDTO
) =>
  (visibleTo.includes(SabotageCardVisibleTo.PRESIDENT) && player.isPresident) ||
  (visibleTo.includes(SabotageCardVisibleTo.RAPPORTEUR) && player.isRapporteur) ||
  visibleTo.includes(SabotageCardVisibleTo.ALL);
