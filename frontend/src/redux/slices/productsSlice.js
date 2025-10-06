import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { NotificationService } from "../../utils/notificationService";

const API_URL = import.meta.env.VITE_API_URL;

// 🧩 Hàm tạo query string từ các bộ lọc (filters)
const buildQuery = (filters) => {
  const query = new URLSearchParams();

  // Duyệt qua từng cặp key-value trong filters
  for (const key in filters) {
    const value = filters[key];

    // Bỏ qua nếu người dùng chưa chọn gì
    if (value === "" || value === null || value === undefined) {
      continue;
    }

    // Thêm cặp key=value vào query string
    query.append(key, value);
  }

  // Trả về chuỗi dạng "key1=value1&key2=value2"
  return query.toString();
};

// 🧩 Lấy danh sách sản phẩm theo bộ lọc
export const fetchProductsByFilters = createAsyncThunk(
  "products/fetchByFilters",
  async (filters, { rejectWithValue }) => {
    try {
      const queryString = buildQuery(filters);
      const response = await axios.get(`${API_URL}/api/products/filters?${queryString}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Lỗi khi tải sản phẩm");
    }
  }
);

// 🧩 Lấy chi tiết 1 sản phẩm theo ID
export const fetchProductDetails = createAsyncThunk(
  "products/fetchDetails",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/products/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Không thể tải chi tiết sản phẩm");
    }
  }
);

// 🧩 Lấy danh sách sản phẩm tương tự
export const fetchSimilarProducts = createAsyncThunk(
  "products/fetchSimilarProducts",
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/products/similar/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Không thể tải sản phẩm tương tự");
    }
  }
);

// 🧩 Slice lưu trữ state sản phẩm
const productsSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    selectedProduct: null,
    similarProducts: [],
    loading: false,
    error: null,
    filters: {
      category: "",
      size: "",
      color: "",
      gender: "",
      brand: "",
      minPrice: "",
      maxPrice: "",
      sortBy: "",
      search: "",
      material: "",
      collection: "",
    },
  },
  reducers: {
    // ✅ Cập nhật bộ lọc (ví dụ khi người dùng chọn size, color...)
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },

    // ✅ Xóa toàn bộ bộ lọc (trả về trạng thái ban đầu)
    clearFilters: (state) => {
      for (const key in state.filters) {
        state.filters[key] = ""; // đặt lại từng filter về rỗng
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // --- Fetch products ---
      .addCase(fetchProductsByFilters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsByFilters.fulfilled, (state, action) => {
        state.loading = false;
        state.products = Array.isArray(action.payload) ? action.payload : [];

        const total = state.products.length;
        const args = action.meta?.arg;

        if (total === 0) {
          NotificationService.warning("Không tìm thấy sản phẩm nào");
        } else if (args?.search) {
          NotificationService.success(`Tìm thấy ${total} sản phẩm`);
        }
      })
      .addCase(fetchProductsByFilters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        NotificationService.error(state.error);
      })

      // --- Fetch single product details ---
      .addCase(fetchProductDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        NotificationService.error(state.error);
      })

      // --- Fetch similar products ---
      .addCase(fetchSimilarProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSimilarProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.similarProducts = Array.isArray(action.payload)
          ? action.payload
          : [];
      })
      .addCase(fetchSimilarProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        NotificationService.error(state.error);
      });
  },
});

export const { setFilters, clearFilters } = productsSlice.actions;
export default productsSlice.reducer;
