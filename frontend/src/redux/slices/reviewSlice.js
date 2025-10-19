import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Helper lấy header token
const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("userToken")}`,
});

// --- Async Thunks ---
export const fetchReviews = createAsyncThunk(
  "reviews/fetchReviews",
  async ({ productId }, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/api/reviews/${productId}`);
      return data;
    } catch (err) {
      return rejectWithValue({
        message: err.response?.data?.message || "Không thể tải đánh giá",
      });
    }
  }
);

export const createReview = createAsyncThunk(
  "reviews/createReview",
  async ({ productId, reviewData }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${API_URL}/api/reviews/${productId}/create`,
        reviewData,
        { headers: getAuthHeader() }
      );
      return data.review; // backend trả {message, review}, chỉ lấy review
    } catch (err) {
      return rejectWithValue({
        message: err.response?.data?.message || "Không thể tạo đánh giá",
      });
    }
  }
);

export const deleteReview = createAsyncThunk(
  "reviews/deleteReview",
  async ({ reviewId }, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(
        `${API_URL}/api/reviews/${reviewId}`,
        {
          headers: getAuthHeader(),
        }
      );
      return { ...data, _id: reviewId };
    } catch (err) {
      return rejectWithValue({
        message: err.response?.data?.message || "Không thể xóa đánh giá",
      });
    }
  }
);

// --- Slice ---
const initialState = {
  reviews: [],
  loading: false,
  error: null,
  avgRating: 0, // thêm field trung bình đánh giá
};

const reviewSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload.reviews;
        state.avgRating = action.payload.avgRating; // số sao trung bình
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // create
      .addCase(createReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews.push(action.payload);
      })
      .addCase(createReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // delete
      .addCase(deleteReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = state.reviews.filter(
          (r) => r._id !== action.payload._id
        );
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      });
  },
});

export default reviewSlice.reducer;
