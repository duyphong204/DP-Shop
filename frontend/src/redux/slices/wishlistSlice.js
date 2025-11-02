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
      const { data } = await axios.get(`${API_URL}/api/wishlist`, {
        headers: getAuthHeader(),
      });
      return data.wishlist; // array object {_id,name,price,image}
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Không thể tải wishlist");
    }
  }
);

// Thêm sản phẩm vào wishlist
export const addToWishlist = createAsyncThunk(
  "wishList/addToWishlist",
  async ({ productId }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${API_URL}/api/wishlist/${productId}`,
        null,
        { headers: getAuthHeader() }
      );
       return data.wishlist[data.wishlist.length - 1]; // chỉ sản phẩm vừa thêm
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Không thể thêm sản phẩm");
    }
  }
);

// Xóa sản phẩm khỏi wishlist
export const removeFromWishlist = createAsyncThunk(
  "wishList/removeFromWishlist",
  async ({ productId }, { rejectWithValue }) => {
    try {
        await axios.delete(`${API_URL}/api/wishlist/${productId}`, {
        headers: getAuthHeader(),
      });
      return productId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Không thể xóa sản phẩm");
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishList",
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchWishlist
      .addCase(fetchWishlist.pending, (state) => { 
        state.loading = true; 
        state.error = null; 
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => { 
        state.loading = false; state.items = action.payload; 
      })
      .addCase(fetchWishlist.rejected, (state, action) => { 
        state.loading = false; state.error = action.payload; 
      })

      // addToWishlist
      .addCase(addToWishlist.fulfilled, (state, action) => { 
        state.items.push(action.payload); // chỉ thêm sản phẩm mới
      })
      
      // removeFromWishlist
      .addCase(removeFromWishlist.fulfilled, (state, action) => { 
        state.items = state.items.filter(item => item._id !== action.payload); // xóa sản phẩm vừa xóa
      });
  },
});

export default wishlistSlice.reducer;
