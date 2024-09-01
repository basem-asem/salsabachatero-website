import { configureStore } from "@reduxjs/toolkit";
import { iconslice } from "./languageSlice";
import userReducer from './userSlice';
import cartReducer from "./cartSlice";
import suppliersReducer from './suppliersSlice';
import locationReducer from './locationSlice';

const store = configureStore({
  reducer: {
    icon: iconslice.reducer,
    user: userReducer,
    cart: cartReducer,
    suppliers: suppliersReducer,
    location: locationReducer,


  },
});

export default store;
