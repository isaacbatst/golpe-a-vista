import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

const api = axios.create({
  baseURL: BASE_URL,
})

export const createLobby = async (name: string) => {
  try {
    const response = await api.post('/lobbies', { name })
    return response.data;
  } catch {
    return null;
  }
}
