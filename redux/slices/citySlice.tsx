import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { GOOGLE_API_KEY } from "../../config";

const GOOGLE_MAPS_API_KEY = GOOGLE_API_KEY;

interface CityState {
  name: string | null;
  country: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: CityState = {
  name: null,
  country: null,
  loading: false,
  error: null,
};

export const fetchCityFromCoords = createAsyncThunk(
  "city/fetchCityFromCoords",
  async (coords: { lat: number; lng: number }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.lat},${coords.lng}&key=${GOOGLE_MAPS_API_KEY}`
      );

      if (response.data.status === "OK") {
        const addressComponents = response.data.results[0].address_components;

        const cityComponent = addressComponents.find((component: any) =>
          component.types.includes("locality")
        );

        const countryComponent = addressComponents.find((component: any) =>
          component.types.includes("country")
        );

        if (cityComponent && countryComponent) {
          return {
            city: cityComponent.long_name,
            country: countryComponent.short_name,
          };
        } else {
          throw new Error("City or country not found");
        }
      } else {
        throw new Error("Failed to fetch city and country");
      }
    } catch (error: string | any) {
      return rejectWithValue(error.message);
    }
  }
);

const citySlice = createSlice({
  name: "maps",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCityFromCoords.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCityFromCoords.fulfilled, (state, action) => {
        state.name = action.payload.city;
        state.country = action.payload.country;
        state.loading = false;
      })
      .addCase(fetchCityFromCoords.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export default citySlice.reducer;
