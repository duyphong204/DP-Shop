import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { NotificationService } from "../../utils/notificationService";

const API_URL = import.meta.env.VITE_API_URL;
const token = localStorage.getItem("userToken");

// --- Async Thunks ---

export const fetchUsers = createAsyncThunk(
  "admin/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      const message = err.response?.data?.message || "Failed to fetch users";
      NotificationService.error(message);
      return rejectWithValue({ message });
    }
  }
);

export const addUser = createAsyncThunk(
  "admin/addUser",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/api/admin/users`, userData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      NotificationService.success("Tạo người dùng thành công");
      return res.data.newUser;
    } catch (err) {
      const message = err.response?.data?.message || "Tạo người dùng thất bại";
      NotificationService.error(message);
      return rejectWithValue({ message });
    }
  }
);

export const updateUser = createAsyncThunk(
  "admin/updateUser",
  async ({ id, name, email, role }, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `${API_URL}/api/admin/users/${id}`,
        { name, email, role },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      NotificationService.success("Cập nhật người dùng thành công");
      return res.data.user;
    } catch (err) {
      const message = err.response?.data?.message || "Cập nhật thất bại";
      NotificationService.error(message);
      return rejectWithValue({ message });
    }
  }
);

export const deleteUser = createAsyncThunk(
  "admin/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      NotificationService.warning("Đã xóa người dùng");
      return id;
    } catch (err) {
      const message = err.response?.data?.message || "Xóa thất bại";
      NotificationService.error(message);
      return rejectWithValue({ message });
    }
  }
);

// --- Slice ---
const adminSlice = createSlice({
  name: "admin",
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // add user
      .addCase(addUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload);
      })
      .addCase(addUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // update user
      .addCase(updateUser.fulfilled, (state, action) => {
        const idx = state.users.findIndex((u) => u._id === action.payload._id);
        if (idx !== -1) state.users[idx] = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.payload?.message;
      })

      // delete user
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u._id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.error = action.payload?.message;
      });
  },
});

export default adminSlice.reducer;
