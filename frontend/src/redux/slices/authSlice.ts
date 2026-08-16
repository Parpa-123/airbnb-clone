import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UserProfile } from "../../Components/Head Components/types";

interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  loading: boolean;
}

const getInitialUser = (): UserProfile | null => {
  try {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

const initialState: AuthState = {
  isAuthenticated: !!localStorage.getItem("accessToken"),
  user: getInitialUser(),
  loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<UserProfile>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      try {
        localStorage.setItem("user", JSON.stringify(action.payload));
      } catch (e) {
        console.error("Failed to save user to localStorage", e);
      }
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    clearCredentials: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("user");
    }
  },
});

export const { setCredentials, logout, setLoading, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
