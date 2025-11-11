    // src/redux/slices/couponUserSlice.js
    import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
    import axios from "axios";

    const API_URL = import.meta.env.VITE_API_URL;

    // Validate mã giảm giá
    export const validateCoupon = createAsyncThunk(
    "couponUser/validate",
    async ({ code, userId, totalPrice }, { rejectWithValue }) => {
        try {
        const { data } = await axios.post(`${API_URL}/api/coupons/validate`, {
            code,
            userId,
            totalPrice,
        });
        return data; // { couponId, code, discountAmount, message }
        } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Mã không hợp lệ");
        }
    }
    );

    // Áp dụng mã (lưu vào CouponUsage)
    export const applyCoupon = createAsyncThunk(
    "couponUser/apply",
    async ({ couponId, userId, orderId }, { rejectWithValue }) => {
        try {
        const { data } = await axios.post(`${API_URL}/api/coupons/apply`, {
            couponId,
            userId,
            orderId,
        });
        return data;
        } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Không thể áp dụng mã");
        }
    }
    );

    const couponUserSlice = createSlice({
    name: "couponUser",
    initialState: {
        coupon: null,
        discountAmount: 0,
        loading: false,
        error: null,
    },
    reducers: {
        clearCoupon: (state) => {
        state.coupon = null;
        state.discountAmount = 0;
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
        })
        .addCase(validateCoupon.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.coupon = null;
            state.discountAmount = 0;
        })
        .addCase(applyCoupon.fulfilled, (state) => {
            state.loading = false;
        });
    },
    });

    export const { clearCoupon } = couponUserSlice.actions;
    export default couponUserSlice.reducer;