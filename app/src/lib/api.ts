import axios from "axios";
import { API_URL } from "../constants";
import { Either, left, right } from "./either";
import { LobbyDTO } from "./api.types";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

const getErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error) && error.response?.data.message) {
    return error.response?.data?.message;
  }

  return fallback;
};

export const getMe = async () => {
  try {
    const response = await api.get<{ id: string }>("/me");
    return response.data;
  } catch {
    return null;
  }
};

export const createLobby = async (name: string) => {
  try {
    const response = await api.post("/lobbies", { name });
    return response.data;
  } catch {
    return null;
  }
};

export const getLobby = async (id: string) => {
  try {
    const response = await api.get(`/lobbies/${id}`);
    return response.data;
  } catch {
    return null;
  }
};

export const joinLobby = async (
  id: string,
  name: string
): Promise<Either<string, LobbyDTO>> => {
  try {
    const response = await api.post<LobbyDTO>(`/lobbies/${id}/join`, { name });
    return right(response.data);
  } catch (err) {
    return left(getErrorMessage(err, "Erro ao entrar no lobby"));
  }
};