import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// --- Fetch Coupons ---
export const fetchCoupons = createAsyncThunk(
  "coupon/fetchCoupons",
  async ({ page = 1 }, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/api/admin/coupons?page=${page}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
      });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Lỗi tải danh sách coupon" });
    }
  }
);

// --- Search Coupons ---
export const searchCoupon = createAsyncThunk(
  "coupon/searchCoupon",
  async ({ term, page = 1 }, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/api/admin/coupons/search?term=${term}&page=${page}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
      });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Lỗi tìm kiếm coupon" });
    }
  }
);

// --- Add Coupon ---
export const addCoupon = createAsyncThunk(
  "coupon/addCoupon",
  async (couponData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${API_URL}/api/admin/coupons`, couponData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
      });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Thêm coupon thất bại" });
    }
  }
);

// --- Update Coupon Status ---
export const toggleCouponStatus = createAsyncThunk(
  "coupon/toggleCouponStatus",
  async ({ id, isActive }, { rejectWithValue }) => {
    try {
      const { data } = await axios.patch(`${API_URL}/api/admin/coupons/${id}/toggle`, { isActive }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
      });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Cập nhật trạng thái thất bại" });
    }
  }
);

// --- Delete Coupon ---
export const deleteCoupon = createAsyncThunk(
  "coupon/deleteCoupon",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/api/admin/coupons/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
      });
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Xóa coupon thất bại" });
    }
  }
);

const couponSlice = createSlice({
  name: "coupon",
  initialState: {
    coupons: [],
    loading: false,
    error: null,
    page: 1,
    totalPages: 1,
    totalItems: 0,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchCoupons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCoupons.fulfilled, (state, action) => {
        state.loading = false;
        state.coupons = action.payload.coupons;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
        state.totalItems = action.payload.totalItems;
      })
      .addCase(fetchCoupons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // Search
      .addCase(searchCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.coupons = action.payload.coupons;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
        state.totalItems = action.payload.totalItems;
      })
      .addCase(searchCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // Add
      .addCase(addCoupon.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(addCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.coupons.unshift(action.payload);
      })
      .addCase(addCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // Toggle
      .addCase(toggleCouponStatus.fulfilled, (state, action) => {
        const index = state.coupons.findIndex((c) => c._id === action.payload._id);
        if (index !== -1) state.coupons[index] = action.payload;
      })

      // Delete
      .addCase(deleteCoupon.fulfilled, (state, action) => {
        state.coupons = state.coupons.filter((c) => c._id !== action.payload);
      });
  },
});

export default couponSlice.reducer;
