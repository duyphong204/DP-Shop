// redux/slices/adminProductSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("userToken")}`,
});

// --- Async Thunks ---
export const fetchAdminProducts = createAsyncThunk(
  "adminProducts/fetchAdminProducts",
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `${API_URL}/api/admin/products?page=${page}&limit=${limit}`,
        { headers: getAuthHeader() }
      );
      return data;
    } catch (err) {
      return rejectWithValue({
        message: err.response?.data?.message || "Failed to fetch products",
      });
    }
  }
);

export const searchAdminProducts = createAsyncThunk(
  "adminProducts/searchAdminProducts",
  async ({ term, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `${API_URL}/api/admin/products/search?term=${term}&page=${page}&limit=${limit}`,
        { headers: getAuthHeader() }
      );
      return data;
    } catch (err) {
      return rejectWithValue({
        message: err.response?.data?.message || "Không tìm thấy sản phẩm",
      });
    }
  }
);

export const createProduct = createAsyncThunk(
  "adminProducts/createProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${API_URL}/api/admin/products`,
        productData,
        { headers: getAuthHeader() }
      );
      return data;
    } catch (err) {
      return rejectWithValue({
        message: err.response?.data?.message || "Tạo sản phẩm thất bại",
      });
    }
  }
);

export const updateProduct = createAsyncThunk(
  "adminProducts/updateProduct",
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(
        `${API_URL}/api/admin/products/${id}`,
        productData,
        { headers: getAuthHeader() }
      );
      return data;
    } catch (err) {
      return rejectWithValue({
        message: err.response?.data?.message || "Cập nhật thất bại",
      });
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "adminProducts/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/api/admin/products/${id}`, {
        headers: getAuthHeader(),
      });
      return id;
    } catch (err) {
      return rejectWithValue({
        message: err.response?.data?.message || "Xóa thất bại",
      });
    }
  }
);

// --- Slice ---
const adminProductSlice = createSlice({
  name: "adminProducts",
  initialState: {
    products: [],
    page: 1,
    totalPages: 1,
    totalItems: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchAdminProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.results;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
        state.totalItems = action.payload.totalItems;
      })
      .addCase(fetchAdminProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // search
      .addCase(searchAdminProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchAdminProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.results;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
        state.totalItems = action.payload.totalItems;
      })
      .addCase(searchAdminProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // create
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.unshift(action.payload); // thêm lên đầu
        state.totalItems += 1;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // update
      .addCase(updateProduct.fulfilled, (state, action) => {
        const idx = state.products.findIndex((p) => p._id === action.payload._id);
        if (idx !== -1) state.products[idx] = action.payload;
      })

      // delete
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p._id !== action.payload);
        state.totalItems -= 1;
      });
  },
});

export default adminProductSlice.reducer;