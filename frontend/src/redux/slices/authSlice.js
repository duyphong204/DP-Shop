import {createSlice,createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

// retrieve user info and token from localStorage if available
const userInfoFromStorage = localStorage.getItem('userInfo') 
                            ? JSON.parse(localStorage.getItem('userInfo')) 
                            : null;
// check for an existing guest ID in the localStorage or generate a new one
const initialGuestId = 
                    localStorage.getItem('guestId') || `guest_${new Date().getTime()}`;
                    localStorage.setItem('guestId', initialGuestId);
// initial state 
const initialState = {
    user : userInfoFromStorage,
    guestId: initialGuestId,
    loading: false,
    error: null,
}

// async thunk for user login
// export const loginUser = createAsyncThunk('auth/loginUser', async(userData,{rejectWithValue})=>{
//     try{
//         const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/users/login`, userData);
//         localStorage.setItem('userInfo', JSON.stringify(response.data.user));
//         localStorage.setItem('userToken', response.data.token);
//         return response.data.user; // return the user object from  the response
//     }catch(error){
//         return rejectWithValue(error.response.data);
//     }
// } )

export const loginUser = createAsyncThunk("auth/loginUser", async (userData, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/users/login`, userData);
        if (response.data.accessToken) { // Sử dụng accessToken từ server
            localStorage.setItem('userInfo', JSON.stringify(response.data.user));
            localStorage.setItem('userToken', response.data.accessToken); // Lưu accessToken
        } else {
            throw new Error("No access token received from server");
        }
        return response.data.user;
    } catch (error) {
        return rejectWithValue(error.response?.data || { message: "Login failed" });
    }
});


// async thunk for user registeration
export const registerUser = createAsyncThunk('auth/registerUser', async(userData,{rejectWithValue})=>{
    try{
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/users/register`, userData);
        if (response.data.accessToken) {
            localStorage.setItem('userInfo', JSON.stringify(response.data.user));
            localStorage.setItem('userToken', response.data.accessToken);
        } else {
            throw new Error("No access token received from server");
        }
        return response.data.user; // return the user object from  the response
    }catch(error){
        return rejectWithValue(error.response?.data || { message: "Registration failed" });
    }
} )
// slice
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logoutUser: (state) => {
            state.user = null;
            state.guestId = `guest_${new Date().getTime()}`; // reset guest ID
            localStorage.removeItem('userInfo');
            localStorage.removeItem('userToken');
            localStorage.setItem('guestId', state.guestId); // keep the guest ID
        },
       generateNewGuestId: (state) => {
            state.guestId = `guest_${new Date().getTime()}`; // generate a new guest ID
            localStorage.setItem('guestId', state.guestId); // store the new guest ID
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || action.error?.message || 'Login failed';
            })


            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || action.error?.message || 'Registration failed';
            })

    }
});

export const { logoutUser, generateNewGuestId } = authSlice.actions;
export default authSlice.reducer;