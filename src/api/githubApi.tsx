import { createAuthRequest } from "@/utils/apiUtils/authRequest";
import { Repos } from "@/types/repos";
import { Users } from "@/types/users";

const baseUrl = import.meta.env.VITE_GITHUB_BASE_URL as string;
const token = import.meta.env.VITE_GITHUB_TOKEN as string;

export const getRepos = async (query: string) => {
  return await createAuthRequest(baseUrl, token).get<Repos>(
    `/repositories?q=${query}`
  );
};

export const getUsers = async (query: string) => {
  return await createAuthRequest(baseUrl, token).get<Users>(
    `/users?q=${query}`
  );
};
