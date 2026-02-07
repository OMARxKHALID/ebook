import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authApi } from "../../lib/api";
import { jwtDecode } from "jwt-decode";

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { dispatch, rejectWithValue }) => {
    try {
      const data = await authApi.login(credentials);
      localStorage.setItem("token", data.token);
      dispatch(fetchProfile());
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const register = createAsyncThunk(
  "auth/register",
  async (userData, { dispatch, rejectWithValue }) => {
    try {
      const data = await authApi.register(userData);
      localStorage.setItem("token", data.token);
      dispatch(fetchProfile());
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const logout = createAsyncThunk("auth/logout", async () => {
  await authApi.logout();
  localStorage.removeItem("token");
});

export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { dispatch, rejectWithValue }) => {
    const token = localStorage.getItem("token");

    const handleRefresh = async () => {
      try {
        const data = await authApi.refresh();
        localStorage.setItem("token", data.token);
        dispatch(fetchProfile());
        const decoded = jwtDecode(data.token);
        return {
          user: { id: decoded.id, role: decoded.role },
          token: data.token,
        };
      } catch (e) {
        localStorage.removeItem("token");
        return rejectWithValue("Session expired");
      }
    };

    // If no token exists, user is not logged in - don't try to refresh
    if (!token) {
      return rejectWithValue("No token found");
    }

    try {
      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {
        return handleRefresh();
      }
      return { user: { id: decoded.id, role: decoded.role }, token };
    } catch (e) {
      return handleRefresh();
    }
  },
);

export const fetchProfile = createAsyncThunk(
  "auth/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const data = await authApi.getProfile();
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: localStorage.getItem("token"),
    isLoading: true,
    error: null,
  },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
      localStorage.setItem("token", action.payload);
    },
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.isLoading = false;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isLoading = false;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isLoading = false;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isLoading = false;
      })
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isLoading = false;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.isLoading = false;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
      });
  },
});

export const { setToken, clearAuth } = authSlice.actions;
export default authSlice.reducer;
