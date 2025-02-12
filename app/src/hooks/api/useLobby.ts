import useSWR from "swr"
import { getLobby } from "../../lib/api"

export const getUseLobbyKey = (lobbyId: string) => `/api/lobbies/${lobbyId}`

export const useLobby = (lobbyId: string) => {
  return useSWR(getUseLobbyKey(lobbyId), () => getLobby(lobbyId))
}