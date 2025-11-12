import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("userToken")}`,
});

// --- Validate mã giảm giá ---
export const validateCoupon = createAsyncThunk(
  "couponUser/validate",
  async ({ code, userId, totalPrice }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${API_URL}/api/coupons/validate`,
        { code, userId, totalPrice },
        { headers: getAuthHeader() }
      );
      return data; // { couponId, code, discountAmount, message }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Mã giảm giá không hợp lệ"
      );
    }
  }
);

const couponUserSlice = createSlice({
  name: "couponUser",
  initialState: {
    coupon: null,
    discountAmount: 0,
    finalTotal: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCoupon: (state) => {
      state.coupon = null;
      state.discountAmount = 0;
      state.finalTotal = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(validateCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(validateCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.coupon = {
          id: action.payload.couponId,
          code: action.payload.code,
        };
        state.discountAmount = action.payload.discountAmount;
        state.finalTotal = action.payload.finalTotal;
      })
      .addCase(validateCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.coupon = null;
        state.discountAmount = 0;
        state.finalTotal = null;
      });
  },
});

export const { clearCoupon } = couponUserSlice.actions;
export default couponUserSlice.reducer;
