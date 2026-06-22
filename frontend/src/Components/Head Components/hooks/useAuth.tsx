import { useDispatch, useSelector } from "react-redux";
import { type RootState } from "../../../redux/store/store";
import { setCredentials, logout as logoutAction, setLoading } from "../../../redux/slices/authSlice";
import * as authService from "../services/auth_service";
import { showSuccess, showError, showInfo, extractErrorMessage, MESSAGES } from "../../../utils/toastMessages";
import { useCallback } from "react";
import type { LoginType, SignupType } from "../types";

export function useAuth() {
  const dispatch = useDispatch();
  const { user, isAuthenticated: login, loading } = useSelector((state: RootState) => state.auth);

  const doLogin = useCallback(async (data: LoginType) => {
    dispatch(setLoading(true));
    try {
      const profile = await authService.login(data);
      dispatch(setCredentials(profile));
      showSuccess(MESSAGES.AUTH.LOGIN_SUCCESS);
      return profile;
    } catch (err: unknown) {
      showError(extractErrorMessage(err, "Login failed"));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const doSignup = useCallback(async (data: SignupType) => {
    dispatch(setLoading(true));
    try {
      await authService.signup(data);
      showInfo(MESSAGES.AUTH.SIGNUP_SUCCESS);
    } catch (err: unknown) {
      showError(extractErrorMessage(err, "Signup failed"));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const logout = useCallback(() => {
    dispatch(logoutAction());
    showInfo(MESSAGES.AUTH.LOGOUT);
  }, [dispatch]);

  const loadProfile = useCallback(async () => {
    try {
      const profile = await authService.fetchProfile();
      dispatch(setCredentials(profile));
    } catch (e) {
      dispatch(logoutAction());
    }
  }, [dispatch]);

  return {
    login,
    setLogin: () => {},
    user,
    loading,
    doLogin,
    doSignup,
    logout,
    loadProfile,
    setUser: (val: any) => {
      if (val) {
        dispatch(setCredentials(val));
      } else {
        dispatch(logoutAction());
      }
    }
  };
}
