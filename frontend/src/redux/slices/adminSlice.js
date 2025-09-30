import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { NotificationService } from "../../utils/notificationService";

// fetch all user (admin only )
export const fetchUsers = createAsyncThunk("admin/fetchUsers", async () => {
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/admin/users`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
    }
  );
  return response.data;
});

// add the create user action
export const addUser = createAsyncThunk(
  "admin/addUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admin/users`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// update user info
export const updateUser = createAsyncThunk(
  "admin/updateUser",
  async ({ id, name, email, role }) => {
    const response = await axios.put(
      `${import.meta.env.VITE_API_URL}/api/admin/users/${id}`,
      { name, email, role },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      }
    );
    return response.data.user;
  }
);

// delete a user
export const deleteUser = createAsyncThunk("admin/deleteUser", async (id) => {
  await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/users/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
  });
  return id;
});

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch users";
        NotificationService.error(state.error);
      })

      // update user
      .addCase(updateUser.fulfilled, (state, action) => {
        const updateUser = action.payload;
        const userIndex = state.users.findIndex(
          (user) => user._id === updateUser._id
        );
        if (userIndex !== -1) {
          state.users[userIndex] = updateUser;
        }
        NotificationService.success("Cập nhật người dùng thành công");
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.error?.message || "Cập nhật người dùng thất bại";
        NotificationService.error(state.error);
      })

      // delet user
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user._id !== action.payload);
        NotificationService.warning("Đã xóa người dùng");
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.error = action.error?.message || "Xóa người dùng thất bại";
        NotificationService.error(state.error);
      })


      // add user
      .addCase(addUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload.newUser); // add a new to the state
        NotificationService.success("Tạo người dùng thành công");
      })
      .addCase(addUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        NotificationService.error(state.error || "Tạo người dùng thất bại");
      });
  },
});

export default adminSlice.reducer;
