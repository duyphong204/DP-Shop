import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// --- Lấy thông tin user từ localStorage ---
const userInfoFromStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

// --- Guest ID: nếu chưa có thì tạo mới
const initialGuestId =
  localStorage.getItem("guestId") || `guest_${new Date().getTime()}`;
localStorage.setItem("guestId", initialGuestId);

// --- Initial state ---
const initialState = {
  user: userInfoFromStorage,
  guestId: initialGuestId,
  loading: false,
  error: null,
};

// --- Async Thunks ---

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/api/users/login`, userData);

      if (!res.data.accessToken)
        throw new Error("Không nhận được access token");

      // Lưu user & token
      localStorage.setItem("userInfo", JSON.stringify(res.data.user));
      localStorage.setItem("userToken", res.data.accessToken);

      return res.data.user;
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Đăng nhập thất bại";
      return rejectWithValue({ message });
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/api/users/register`, userData);

      if (!res.data.accessToken)
        throw new Error("Không nhận được access token");

      // Lưu user & token
      localStorage.setItem("userInfo", JSON.stringify(res.data.user));
      localStorage.setItem("userToken", res.data.accessToken);

      return res.data.user;
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Đăng ký thất bại";
      return rejectWithValue({ message });
    }
  }
);

// --- Slice ---
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logoutUser: (state) => {
      state.user = null;
      state.guestId = `guest_${new Date().getTime()}`;
      localStorage.removeItem("userInfo");
      localStorage.removeItem("userToken");
      localStorage.setItem("guestId", state.guestId);
    },
    generateNewGuestId: (state) => {
      state.guestId = `guest_${new Date().getTime()}`;
      localStorage.setItem("guestId", state.guestId);
    },
  },
  extraReducers: (builder) => {
    // --- Login ---
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Đăng nhập thất bại";
      });

    // --- Register ---
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Đăng ký thất bại";
      });
  },
});

export const { logoutUser, generateNewGuestId } = authSlice.actions;
export default authSlice.reducer;
