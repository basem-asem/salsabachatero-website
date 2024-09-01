import { createSlice } from '@reduxjs/toolkit';

const locationSlice = createSlice({
  name: 'location',
  initialState: {
    userLocation: { lat: 0, lng: 0 },
    city:''
  },
  reducers: {
    setUserLocation: (state, action) => {
      state.userLocation = action.payload;
      state.city = action.payload.city;
    },
  },
});

export const { setUserLocation } = locationSlice.actions;
export default locationSlice.reducer;
