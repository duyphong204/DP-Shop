import  {configureStore} from '@reduxjs/toolkit';
import authReducer from './slices/authSlice'; 
import productsReducer from './slices/productsSlice';
import cartReducer from './slices/cartSlice';
import checkoutReducer from './slices/checkoutSlice';
import orderReducer from './slices/orderSlice';
import adminReducer from './slices/adminSlice'
import adminProductReducer from './slices/adminProductSlice'
import adminOrdersReducer from './slices/adminOrderSlice'
import reviewReducer from './slices/reviewSlice'
import wishlistSlice from './slices/wishlistSlice'
import couponAdminSlice from './slices/couponAdminSlice'
import couponUserReducer from "./slices/couponUserSlice";
const store = configureStore({
    reducer:{
    auth: authReducer, 
    products: productsReducer,
    cart: cartReducer,
    checkout: checkoutReducer,
    orders: orderReducer,
    admin: adminReducer,
    adminProducts: adminProductReducer,
    adminOrders : adminOrdersReducer,
    reviews : reviewReducer,
    wishList : wishlistSlice,
    coupon : couponAdminSlice,
    couponUser: couponUserReducer,
    },
    devTools: true, // bật DevTools
})

export default store;