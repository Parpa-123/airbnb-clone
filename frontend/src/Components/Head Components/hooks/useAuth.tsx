import { useEffect, useState, useCallback } from "react";
import { showSuccess, showError, showInfo, extractErrorMessage, MESSAGES } from "../../../utils/toastMessages";
import type { UserProfile, LoginType, SignupType } from "../types";
import * as authService from "../services/auth.service";

export function useAuth() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);

  const loadProfile = useCallback(async () => {
    try {
      const profile = await authService.fetchProfile();
      setUser(profile);
    } catch (e) {
      // token might be invalid/expired
      setUser(null);
    }
  }, []);

  useEffect(() => {
    // try to load profile if tokens exist
    const token = localStorage.getItem("accessToken");
    if (token) loadProfile();
  }, [loadProfile]);

  const doLogin = useCallback(async (data: LoginType) => {
    setLoading(true);
    try {
      const profile = await authService.login(data);
      setUser(profile);
      showSuccess(MESSAGES.AUTH.LOGIN_SUCCESS);
      return profile;
    } catch (err: unknown) {
      showError(extractErrorMessage(err, "Login failed"));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const doSignup = useCallback(async (data: SignupType) => {
    setLoading(true);
    try {
      const profile = await authService.signup(data);
      setUser(profile);
      showSuccess(MESSAGES.AUTH.SIGNUP_SUCCESS);
      return profile;
    } catch (err: unknown) {
      showError(extractErrorMessage(err, "Signup failed"));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authService.clearTokens();
    setUser(null);
    showInfo(MESSAGES.AUTH.LOGOUT);
  }, []);

  return { user, loading, doLogin, doSignup, logout, loadProfile, setUser };
}

