import { CrisisVisibleTo, PlayerDTO } from "@/lib/api.types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isCrisisVisible = (
  visibleTo: CrisisVisibleTo[],
  player: PlayerDTO
) =>
  (visibleTo.includes(CrisisVisibleTo.PRESIDENT) && player.isPresident) ||
  (visibleTo.includes(CrisisVisibleTo.RAPPORTEUR) && player.isRapporteur) ||
  visibleTo.includes(CrisisVisibleTo.ALL);
