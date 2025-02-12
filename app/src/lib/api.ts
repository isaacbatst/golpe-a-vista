import axios from "axios";
import { API_URL } from "../constants";


const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
})

export const getMe = async () => {
  try {
    const response = await api.get<{ id: string }>('/me')
    return response.data;
  } catch {
    return null;
  }
}

export const createLobby = async (name: string) => {
  try {
    const response = await api.post('/lobbies', { name })
    return response.data;
  } catch {
    return null;
  }
}

export const getLobby = async (id: string) => {
  try {
    const response = await api.get(`/lobbies/${id}`)
    return response.data;
  } catch {
    return null;
  }
}

export const joinLobby = async (id: string, name: string) => {
  try {
    const response = await api.post(`/lobbies/${id}/join`, { name })
    return response.data;
  } catch {
    return null;
  }
}
