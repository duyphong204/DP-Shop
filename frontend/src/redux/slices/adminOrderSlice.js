// redux/slices/adminOrderSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const getAuthHeader = () => ({ Authorization: `Bearer ${localStorage.getItem("userToken")}` });

export const fetchAllOrders = createAsyncThunk(
  "adminOrders/fetchAllOrders",
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/api/admin/orders?page=${page}&limit=${limit}`, { headers: getAuthHeader() });
      return data;
    } catch (err) {
      return rejectWithValue({ message: err.response?.data?.message || "Lỗi tải đơn hàng" });
    }
  }
);

export const searchOrder = createAsyncThunk(
  "adminOrders/searchOrder",
  async ({ term, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/api/admin/orders/search?term=${term}&page=${page}&limit=${limit}`, { headers: getAuthHeader() });
      return data;
    } catch (err) {
      return rejectWithValue({ message: err.response?.data?.message || "Không tìm thấy" });
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  "adminOrders/updateOrderStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(`${API_URL}/api/admin/orders/${id}`, { status }, { headers: getAuthHeader() });
      return data;
    } catch (err) {
      return rejectWithValue({ message: err.response?.data?.message || "Cập nhật thất bại" });
    }
  }
);
export const deleteOrder = createAsyncThunk(
  "adminOrders/deleteOrder",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/api/admin/orders/${id}`, {
        headers: getAuthHeader(),
      });
      return id;
    } catch (err) {
      return rejectWithValue({
        message: err.response?.data?.message || "Failed to delete order",
      });
    }
  }
);

const adminOrderSlice = createSlice({
  name: "adminOrders",
  initialState: {
    orders: [],
    page: 1,
    totalPages: 1,
    totalItems: 0,
    totalSales:0,
    processingCount: 0,
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllOrders.pending, (state) => { state.loading = true; })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.results;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
        state.totalItems = action.payload.totalItems;
        state.totalSales = action.payload.results.reduce(
          (sum, order) => sum + (order.totalPrice ?? 0),0);
        state.processingCount = action.payload.results.filter(o => o.status === "Processing").length;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
      // search
      .addCase(searchOrder.fulfilled, (state, action) => {
        state.orders = action.payload.results;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
        state.totalItems = action.payload.totalItems;
        state.totalSales = action.payload.results.reduce(
          (sum, order) => sum + (order.totalPrice ?? 0),0);
        state.processingCount = action.payload.results.filter(o => o.status === "Processing").length;
        })
      // update
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const idx = state.orders.findIndex(o => o._id === action.payload._id);
        if (idx !== -1) state.orders[idx] = action.payload;
      })
       // delete
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.orders = state.orders.filter((o) => o._id !== action.payload);
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.error = action.payload?.message;
      })
  },
});

export default adminOrderSlice.reducer;