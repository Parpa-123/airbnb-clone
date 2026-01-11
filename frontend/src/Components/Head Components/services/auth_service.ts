import axiosInstance from "../../../../public/connect";
import type { LoginType, SignupType, UserProfile } from "../types";

/**
 * Service centralizing auth-related API calls and token handling.
 * - login/signup return the loaded profile for convenience.
 */

const ACCESS_KEY = "accessToken";
const REFRESH_KEY = "refreshToken";

async function saveTokens(access: string, refresh: string) {
  localStorage.setItem(ACCESS_KEY, access);
  localStorage.setItem(REFRESH_KEY, refresh);
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

export async function fetchProfile(): Promise<UserProfile> {
  const res = await axiosInstance.get("/me/");
  return res.data as UserProfile;
}

export async function login(data: LoginType): Promise<UserProfile> {
  const tokenRes = await axiosInstance.post("/token/", data);
  await saveTokens(tokenRes.data.access, tokenRes.data.refresh);
  return fetchProfile();
}

export async function signup(data: SignupType): Promise<void> {
  // create user (no auto-login)
  await axiosInstance.post("/create/", data);
}
