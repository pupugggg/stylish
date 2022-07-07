import { configureStore } from '@reduxjs/toolkit'
import productReducer from '../features/product/productSlice'
import authReducer from '../features/auth/authSlice'
import orderReducer from '../features/order/orderSlice'
import adminReducer from '../features/admin/adminSlice'
export const store = configureStore({
    reducer: {
        product: productReducer,
        auth:authReducer,
        order:orderReducer,
        admin:adminReducer
    },
})
