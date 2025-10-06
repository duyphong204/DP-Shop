import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { NotificationService } from "../../utils/notificationService";

const API_URL = import.meta.env.VITE_API_URL;

// helper để lấy token luôn mới nhất
const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("userToken")}`,
});

// --- Async Thunks ---
export const fetchAllOrders = createAsyncThunk(
  "adminOrders/fetchAllOrders",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/api/admin/orders`, {
        headers: getAuthHeader(),
      });
      return data;
    } catch (err) {
      const message = err.response?.data?.message || "Không thể tải đơn hàng (admin)";
      NotificationService.error(message);
      return rejectWithValue({ message });
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  "adminOrders/updateOrderStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(
        `${API_URL}/api/admin/orders/${id}`,
        { status },
        { headers: getAuthHeader() }
      );
      NotificationService.success("Cập nhật trạng thái đơn hàng thành công");
      return data;
    } catch (err) {
      const message = err.response?.data?.message || "Cập nhật trạng thái đơn hàng thất bại";
      NotificationService.error(message);
      return rejectWithValue({ message });
    }
  }
);

export const deleteOrder = createAsyncThunk(
  "adminOrders/deleteOrder",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/api/admin/orders/${id}`, { headers: getAuthHeader() });
      NotificationService.warning("Đã xóa đơn hàng");
      return id;
    } catch (err) {
      const message = err.response?.data?.message || "Xóa đơn hàng thất bại";
      NotificationService.error(message);
      return rejectWithValue({ message });
    }
  }
);

// --- Slice ---
const adminOrderSlice = createSlice({
  name: "adminOrders",
  initialState: {
    orders: [],
    totalOrders: 0,
    totalSales: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
        state.totalOrders = action.payload.length;
        state.totalSales = action.payload.reduce((acc, order) => acc + order.totalPrice, 0);
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // update status
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const idx = state.orders.findIndex((o) => o._id === action.payload._id);
        if (idx !== -1) state.orders[idx] = action.payload;
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.error = action.payload?.message;
      })

      // delete
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.orders = state.orders.filter((o) => o._id !== action.payload);
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.error = action.payload?.message;
      });
  },
});

export default adminOrderSlice.reducer;
