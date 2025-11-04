// redux/slices/adminSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("userToken")}`,
});

export const fetchUsers = createAsyncThunk(
  "admin/fetchUsers",
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `${API_URL}/api/admin/users?page=${page}&limit=${limit}`,
        { headers: getAuthHeader() }
      );
      return data;
    } catch (err) {
      return rejectWithValue({
        message: err.response?.data?.message || "Lỗi tải người dùng",
      });
    }
  }
);

export const searchUser = createAsyncThunk(
  "admin/searchUser",
  async ({ term, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `${API_URL}/api/admin/users/search?term=${term}&page=${page}&limit=${limit}`,
        { headers: getAuthHeader() }
      );
      return data;
    } catch (err) {
      return rejectWithValue({
        message: err.response?.data?.message || "Không tìm thấy",
      });
    }
  }
);

export const addUser = createAsyncThunk(
  "admin/addUser",
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${API_URL}/api/admin/users`,
        userData,
        { headers: getAuthHeader() }
      );
      return data.newUser;
    } catch (err) {
      return rejectWithValue({
        message: err.response?.data?.message || "Thêm thất bại",
      });
    }
  }
);

export const updateUser = createAsyncThunk(
  "admin/updateUser",
  async ({ id, name, email, role }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(
        `${API_URL}/api/admin/users/${id}`,
        { name, email, role },
        { headers: getAuthHeader() }
      );
      return data;
    } catch (err) {
      return rejectWithValue({
        message: err.response?.data?.message || "Cập nhật thất bại",
      });
    }
  }
);

export const deleteUser = createAsyncThunk(
  "admin/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/api/admin/users/${id}`, {
        headers: getAuthHeader(),
      });
      return id;
    } catch (err) {
      return rejectWithValue({
        message: err.response?.data?.message || "Xóa thất bại",
      });
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    users: [],
    page: 1,
    totalPages: 1,
    totalItems: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.results;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
        state.totalItems = action.payload.totalItems;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      .addCase(searchUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.results;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
        state.totalItems = action.payload.totalItems;
      })
      .addCase(searchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      .addCase(addUser.fulfilled, (state, action) => {
        state.users.unshift(action.payload);
        state.totalItems += 1;
      })

      .addCase(updateUser.fulfilled, (state, action) => {
        const idx = state.users.findIndex((u) => u._id === action.payload._id);
        if (idx !== -1) state.users[idx] = action.payload;
      })

      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u._id !== action.payload);
        state.totalItems -= 1;
      });
  },
});

export default adminSlice.reducer;