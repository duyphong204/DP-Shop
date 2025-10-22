// redux/slices/wishlistSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("userToken")}`,
});

// Lấy danh sách wishlist
export const fetchWishlist = createAsyncThunk(
  "wishList/fetchWishlist",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/wishlist`, {
        headers: getAuthHeader(),
      });
      console.log("fetchWishlist response:", response.data);
      return response.data.wishlist; // Chỉ lấy mảng wishlist
    } catch (err) {
      return rejectWithValue({
        message:
          err.response?.data?.message || "Không thể tải danh sách yêu thích",
      });
    }
  }
);

// Thêm sản phẩm vào wishlist
export const addToWishlist = createAsyncThunk(
  "wishList/addToWishlist",
  async ({ productId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/wishlist/${productId}`,
        null, // body rỗng
        {
          headers: getAuthHeader(),
        }
      );
      console.log("addToWishlist response:", response.data);
      return response.data.wishlist; // Chỉ lấy mảng wishlist
    } catch (err) {
      return rejectWithValue({
        message:
          err.response?.data?.message || "Không thể thêm sản phẩm vào danh sách yêu thích",
      });
    }
  }
);

// Xóa sản phẩm khỏi wishlist
export const removeFromWishlist = createAsyncThunk(
  "wishList/removeFromWishlist",
  async ({ productId }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${API_URL}/api/wishlist/${productId}`,
        {
          headers: getAuthHeader(),
        }
      );
      console.log("removeFromWishlist response:", response.data);
      return response.data.wishlist; // Chỉ lấy mảng wishlist
    } catch (err) {
      return rejectWithValue({
        message:
          err.response?.data?.message || "Không thể xóa sản phẩm khỏi danh sách yêu thích",
      });
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishList",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // --- fetchWishlist ---
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload; // luôn là mảng
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // --- addToWishlist ---
      .addCase(addToWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload; // cập nhật toàn bộ mảng
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // --- removeFromWishlist ---
      .addCase(removeFromWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload; // cập nhật toàn bộ mảng
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      });
  },
});

export default wishlistSlice.reducer;
