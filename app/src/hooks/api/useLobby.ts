import useSWR from "swr"
import { getLobby } from "../../lib/api"
import { LobbyDTO } from "../../lib/api.types"

export const getUseLobbyKey = (lobbyId: string) => `/api/lobbies/${lobbyId}`

export const useLobby = (lobbyId: string) => {
  return useSWR<LobbyDTO>(getUseLobbyKey(lobbyId), () => getLobby(lobbyId))
}