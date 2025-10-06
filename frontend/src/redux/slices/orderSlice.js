import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { NotificationService } from "../../utils/notificationService";

const API_URL = import.meta.env.VITE_API_URL;

// helper để lấy token luôn mới nhất
const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("userToken")}`,
});

// --- Async Thunks ---
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
      NotificationService.error(message);
      return rejectWithValue({ message });
    }
  }
);

export const fetchOrderDetails = createAsyncThunk(
  "order/fetchOrderDetails",
  async (orderId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/api/orders/${orderId}`, {
        headers: getAuthHeader(),
      });
      return data;
    } catch (err) {
      const message = err.response?.data?.message || "Không thể tải chi tiết đơn hàng";
      NotificationService.error(message);
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
      // fetch user orders
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
        state.totalOrder = action.payload.length;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // fetch order details
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
