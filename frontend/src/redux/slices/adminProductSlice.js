import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { NotificationService } from "../../utils/notificationService";

const API_URL = `${import.meta.env.VITE_API_URL}`;
const USER_TOKEN = `Bearer ${localStorage.getItem("userToken")}`;

// async thunk to fetch admin products
export const fetchAdminProducts = createAsyncThunk(
"adminProducts/fetchAdminProducts",
  async () => {
    const response = await axios.get(`${API_URL}/api/admin/products`, {
      headers: {
        Authorization: USER_TOKEN,
      },
    });
    return response.data;
  }
);

// async function to create a new product
export const createProduct = createAsyncThunk(
  "adminProducts/createProduct",
  async (productData) => {
    const response = await axios.post(
      `${API_URL}/api/admin/products`,
      productData,
      {
        headers: {
          Authorization: USER_TOKEN,
        },
      }
    );
    NotificationService.success("Tạo sản phẩm thành công");
    return response.data;
  }
);

export const updateProduct = createAsyncThunk(
  "adminProducts/updateProduct",
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/admin/products/${id}`,
        productData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// async thunk to delete a product
export const deleteProduct = createAsyncThunk(
  "adminProducts/deleteProducts",
  async (id) => {
    await axios.delete(`${API_URL}/api/admin/products/${id}`, {
      headers: {
        Authorization: USER_TOKEN,
      },
    });
    return id;
  }
);

const adminProductSlice = createSlice({
  name: "adminProducts",
  initialState: {
    products: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchAdminProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        NotificationService.error(
          state.error || "Không thể tải danh sách sản phẩm (admin)"
        );
      })

      // create product
      .addCase(createProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
        // success toast đã bắn trong thunk
      })
      // update product
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(
          (product) => product._id === action.payload._id
        );
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        NotificationService.success("Cập nhật sản phẩm thành công");
      })
      // delete product
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(
          (product) => product._id !== action.payload
        );
        NotificationService.warning("Đã xóa sản phẩm");
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.error = action.payload?.message || "Cập nhật sản phẩm thất bại";
        NotificationService.error(state.error);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.error = action.payload?.message || "Xóa sản phẩm thất bại";
        NotificationService.error(state.error);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.error = action.payload?.message || "Tạo sản phẩm thất bại";
        NotificationService.error(state.error);
      });
  },
});

export default adminProductSlice.reducer;
