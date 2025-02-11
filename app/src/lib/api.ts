import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
})

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
