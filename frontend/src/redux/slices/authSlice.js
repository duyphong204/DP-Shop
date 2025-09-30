import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { NotificationService } from "../../utils/notificationService";

// lấy thông tin người dùng và mã thông báo từ localStorage nếu có
const userInfoFromStorage = localStorage.getItem("userInfo")
                            ? JSON.parse(localStorage.getItem("userInfo"))
                            : null;
// kiểm tra ID khách hiện có trong localStorage hoặc tạo một ID mới
const initialGuestId =
                      localStorage.getItem("guestId") || `guest_${new Date().getTime()}`;
                      localStorage.setItem("guestId", initialGuestId);
// initial state
const initialState = {
  user: userInfoFromStorage,
  guestId: initialGuestId,
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk("auth/loginUser",async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/users/login`,userData);
      if (response.data.accessToken) { // Sử dụng accessToken từ server
        localStorage.setItem("userInfo", JSON.stringify(response.data.user));
        localStorage.setItem("userToken", response.data.accessToken); // Lưu accessToken
        NotificationService.success(
          `Chào mừng ${response.data.user.name || " "}! Đăng nhập thành công`
        );
      } else {
        throw new Error("No access token received from server");
      }
      return response.data.user;
    } catch (error) {
      NotificationService.error(
        `Đăng nhập thất bại: ${
          error.response?.data?.message || error.message || "Login failed"
        }`
      );
      return rejectWithValue(
        error.response?.data || { message: "Login failed" }
      );
    }
  }
);

// async thunk for user registeration
export const registerUser = createAsyncThunk("auth/registerUser",async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/users/register`,userData);
      if (response.data.accessToken) {
        localStorage.setItem("userInfo", JSON.stringify(response.data.user));
        localStorage.setItem("userToken", response.data.accessToken);
        NotificationService.success(
          `Chào mừng ${response.data.user.name || ""}! Đăng ký thành công`
        );
      } else {
        throw new Error("No access token received from server");
      }
      return response.data.user; // return the user object from  the response
    } catch (error) {
      NotificationService.error(
        `Đăng ký thất bại: ${
          error.response?.data?.message ||
          error.message ||
          "Registration failed"
        }`
      );
      return rejectWithValue(
        error.response?.data || { message: "Registration failed" }
      );
    }
  }
);
// slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logoutUser: (state) => {
      state.user = null;
      state.guestId = `guest_${new Date().getTime()}`; // reset guest ID
      localStorage.removeItem("userInfo");
      localStorage.removeItem("userToken");
      localStorage.setItem("guestId", state.guestId); // keep the guest ID
      NotificationService.info("Đã đăng xuất thành công");
    },
    generateNewGuestId: (state) => {
      state.guestId = `guest_${new Date().getTime()}`; // generate a new guest ID
      localStorage.setItem("guestId", state.guestId); // store the new guest ID
    },
  },
  extraReducers: (builder) => {
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
        state.error =
          action.payload?.message || action.error?.message || "Login failed";
      })

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
        state.error =
          action.payload?.message ||
          action.error?.message ||
          "Registration failed";
      });
  },
});

export const { logoutUser, generateNewGuestId } = authSlice.actions;
export default authSlice.reducer;
