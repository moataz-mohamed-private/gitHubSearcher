import axios from "axios";

export const createAuthRequest = (baseURL: string, token?: string | null) => {
  const authRequest = axios.create({
    baseURL: baseURL,
    headers: {
      "Content-type": "application/vnd.github+json",
      Accept: "application/vnd.github+json",
    },
  });

  authRequest.interceptors.request.use(
    (config) => {
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    },
    async (error) => await Promise.reject(error)
  );

  return authRequest;
};
