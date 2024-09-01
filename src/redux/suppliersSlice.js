import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getUsersByType } from '@/firebase/firebaseutils';

export const fetchSuppliers = createAsyncThunk(
  'suppliers/fetchSuppliers',
  async () => {
    const products = await getUsersByType("users", "Supplier");
    return products.map(element => {
      const array = element.rating;
      const sum = array ? array.reduce((acc, cur) => acc + cur, 0) : 0;
      const average = array ? sum / array.length : 0;
      element.averageRating = array && array.length > 0 ? average.toFixed() : 0;
      return element;
    });
  }
);

const suppliersSlice = createSlice({
  name: 'suppliers',
  initialState: {
    suppliers: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSuppliers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSuppliers.fulfilled, (state, action) => {
        state.suppliers = action.payload;
        state.loading = false;
      })
      .addCase(fetchSuppliers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default suppliersSlice.reducer;
