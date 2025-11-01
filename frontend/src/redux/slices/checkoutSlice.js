import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

/* 1. Tạo Checkout */
export const createCheckout = createAsyncThunk(
  "checkout/createCheckout",
  async (checkoutData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/checkout`,
        checkoutData,
        { headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` } }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Không thể tạo đơn hàng" });
    }
  }
);

/* 2. Đánh dấu thanh toán thành công */
export const markCheckoutAsPaid = createAsyncThunk(
  "checkout/markAsPaid",
  async ({ checkoutId, paymentDetails }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/checkout/${checkoutId}/pay`,
        { paymentStatus: "Paid", paymentDetails },
        { headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` } }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Cập nhật thanh toán thất bại" });
    }
  }
);

/* 3. Hoàn tất đơn hàng */
export const finalizeCheckout = createAsyncThunk(
  "checkout/finalizeCheckout",
  async (checkoutId, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/checkout/${checkoutId}/finalize`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` } }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Hoàn tất đơn hàng thất bại" });
    }
  }
);

const checkoutSlice = createSlice({
  name: "checkout",
  initialState: {
    checkout: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // --- createCheckout ---
    builder
      .addCase(createCheckout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCheckout.fulfilled, (state, action) => {
        state.loading = false;
        state.checkout = action.payload;
      })
      .addCase(createCheckout.rejected, (state, action) => {
        state.loading = false;
        state.error = Array.isArray(action.payload?.errors)
          ? action.payload.errors.join(" | ")
          : action.payload?.message || "Không thể tạo đơn hàng";
      })

      // --- markAsPaid ---
      .addCase(markCheckoutAsPaid.pending, (state) => {
        state.loading = true;
      })
      .addCase(markCheckoutAsPaid.fulfilled, (state, action) => {
        state.loading = false;
        state.checkout = action.payload;
      })
      .addCase(markCheckoutAsPaid.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Cập nhật thanh toán thất bại";
      })

      // --- finalizeCheckout ---
      .addCase(finalizeCheckout.pending, (state) => {
        state.loading = true;
      })
      .addCase(finalizeCheckout.fulfilled, (state) => {
        state.loading = false;
        state.checkout = null;
      })
      .addCase(finalizeCheckout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Hoàn tất đơn hàng thất bại";
      });
  },
});

export default checkoutSlice.reducer;