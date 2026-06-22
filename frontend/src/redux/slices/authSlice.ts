import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UserProfile } from "../../Components/Head Components/types";

interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  loading: boolean;
}

const initialState: AuthState = {
  isAuthenticated: !!localStorage.getItem("accessToken"),
  user: null,
  loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<UserProfile>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    clearCredentials: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    }
  },
});

export const { setCredentials, logout, setLoading, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
