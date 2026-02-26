import { configureStore } from '@reduxjs/toolkit'
import authReducer from './feature/auth/authSlice'
import serviceReducer from './feature/services/serviceSlice'
import cartReducer from './feature/cartSlice'


//  Creating the Redux store that holds the global app state
//  Every slice (like auth, products, orders, etc.) will be added as a reducer here
export const store = configureStore({
    reducer: {
        //  "auth" → key used to access state in components (state.auth)
        //  authReducer → logic that manages login/signup/logout
        auth: authReducer,
        service: serviceReducer,
        cart: cartReducer,
    },
}) 