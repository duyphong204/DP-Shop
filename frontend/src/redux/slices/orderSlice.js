import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// async thunk to fetch user orders 
export const fetchUserOrders = createAsyncThunk("order/fetchUserOrders", 
    async (_, { rejectWithValue }) => {
        const token = localStorage.getItem('userToken');
        if (!token) {
            return rejectWithValue({ message: "No token available" });
        }
    try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/orders/my-orders`, 
        {
            headers:{
                Authorization: `Bearer ${localStorage.getItem("userToken")}`
            }
          }
     );
        return response.data;
    } catch (err) {
        return rejectWithValue(err.response.data);
}});

// async thunk to fetch orders details by ID
export const fetchOrderDetails = createAsyncThunk("order/fetchOrderDetails", 
    async (orderId, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/orders/${orderId}`, 
        {
            headers:{
                Authorization: `Bearer ${localStorage.getItem("userToken")}`
            }
        }
     );
        return response.data;
    } catch (err) {
        return rejectWithValue(err.response.data);
}});

const orderSlice = createSlice({
    name: "orders",
    initialState: {
        orders: [],
        totalOrder: 0,
        orderDetails: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {  
        builder
        // fetch user orders
        .addCase(fetchUserOrders.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchUserOrders.fulfilled, (state, action) => {
            state.loading = false;
            state.orders = action.payload;
        })
        .addCase(fetchUserOrders.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload.message || "Failed to fetch orders";
        })

        // fetch order details
        .addCase(fetchOrderDetails.pending, (state) => {
            state.loading = true;
            state.error = null;
        }
        )
        .addCase(fetchOrderDetails.fulfilled, (state, action) => {
            state.loading = false;
            state.orderDetails = action.payload;
        }
        )
        .addCase(fetchOrderDetails.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload.message || "Failed to fetch order details";
        });
    }
});

export default orderSlice.reducer;