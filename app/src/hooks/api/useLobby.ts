import useSWR from "swr"
import { getLobby } from "../../lib/api"

export const useLobby = (lobbyId: string) => {
  return useSWR(`/api/lobbies/${lobbyId}`, () => getLobby(lobbyId))
}