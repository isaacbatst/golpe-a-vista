import useSWR from "swr";
import { getMe } from "../../lib/api";

export const getMeKey = () => `/api/me`;

export const useMe = () => {
  return useSWR(getMeKey(), () => getMe());
};
