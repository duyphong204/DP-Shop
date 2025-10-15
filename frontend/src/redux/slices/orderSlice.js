import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Helper để lấy header có token
const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("userToken")}`,
});

// --- Async Thunks ---

// Lấy danh sách đơn hàng của user
export const fetchUserOrders = createAsyncThunk(
  "order/fetchUserOrders",
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem("userToken");
    if (!token) return rejectWithValue({ message: "Bạn chưa đăng nhập" });

    try {
      const { data } = await axios.get(`${API_URL}/api/orders/my-orders`, {
        headers: getAuthHeader(),
      });
      return data;
    } catch (err) {
      const message = err.response?.data?.message || "Không thể tải đơn hàng";
      return rejectWithValue({ message });
    }
  }
);

// Lấy chi tiết đơn hàng
export const fetchOrderDetails = createAsyncThunk(
  "order/fetchOrderDetails",
  async (orderId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/api/orders/${orderId}`, {
        headers: getAuthHeader(),
      });
      return data;
    } catch (err) {
      const message =
        err.response?.data?.message || "Không thể tải chi tiết đơn hàng";
      return rejectWithValue({ message });
    }
  }
);

// --- Slice ---
const orderSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],
    totalOrder: 0,
    orderDetails: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // --- Fetch user orders ---
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
        state.totalOrder = action.payload?.length || 0;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // --- Fetch order details ---
      .addCase(fetchOrderDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.orderDetails = action.payload;
      })
      .addCase(fetchOrderDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      });
  },
});

export default orderSlice.reducer;
