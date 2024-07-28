import { createAuthRequest } from "@/utils/apiUtils/authRequest";
import { Repos } from "@/types/repos";
import { Users } from "@/types/users";

const baseUrl = import.meta.env.VITE_GITHUB_BASE_URL as string;
const token = import.meta.env.VITE_GITHUB_TOKEN as string;

type searchParams = { page: number };

export const getRepos = async (
  query: string,
  params: searchParams = { page: 1 }
) => {
  return await createAuthRequest(baseUrl, token).get<Repos>(
    `/repositories?q=${query}`,
    { params: { ...params } }
  );
};

export const getUsers = async (
  query: string,
  params: searchParams = { page: 1 }
) => {
  return await createAuthRequest(baseUrl, token).get<Users>(
    `/users?q=${query}`,
    { params: { ...params } }
  );
};
