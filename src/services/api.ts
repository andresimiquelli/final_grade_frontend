import axios, { Axios } from "axios";

export const baseUrl = "https://diariodigital-api.moriaeducacao.com.br/api/v1";
//export const baseUrl = "http://localhost:8000/api/v1";

export const version = "230108-0";

const api = axios.create({
  baseURL: baseUrl,
});

function useApi(token: string = ""): Axios {
  if (token.length > 0) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  return api;
}

export { useApi };
