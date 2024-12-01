import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GEOCODING_API_KEY } from "../../config";

const initialState = {
  nearbyCities: [],
  loading: false,
  error: null,
};

interface Coordinates {
  lat: number;
  lng: number;
}

export const fetchNearbyCities = createAsyncThunk(
  "cityNearby/fetchNearbyCities",
  async (coords: Coordinates, { rejectWithValue }) => {
    const { lat, lng } = coords;
    const API_KEY = GEOCODING_API_KEY;

    try {
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${API_KEY}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error("Failed to fetch nearby cities");
      }

      const cities = data.results
        .slice(0, 5)
        .map((result: any) => result.components.city);
      return cities;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const cityNearbySlice = createSlice({
  name: "cityNearby",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNearbyCities.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNearbyCities.fulfilled, (state, action) => {
        state.loading = false;
        state.nearbyCities = action.payload;
        state.error = null;
      })
      .addCase(fetchNearbyCities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default cityNearbySlice.reducer;
