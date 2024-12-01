import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RAPIDAPI_KEY } from "../../config";

const initialState = {
  nearbyAirports: [],
  loading: false,
  error: null,
};

interface Coordinates {
  lat: number;
  lng: number;
}

interface Airport {
  name: string;
  code: string;
  country: string;
}

export const fetchNearbyAirports = createAsyncThunk(
  "airports/fetchNearbyAirports",
  async (coords: Coordinates, { rejectWithValue }) => {
    const { lat, lng } = coords;
    const API_KEY = RAPIDAPI_KEY;

    try {
      const response = await fetch(
        `https://sky-scrapper.p.rapidapi.com/api/v1/flights/getNearByAirports?lat=${lat}&lng=${lng}&locale=en-US`,
        {
          method: "GET",
          headers: {
            "x-rapidapi-host": "sky-scrapper.p.rapidapi.com",
            "x-rapidapi-key": API_KEY,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch nearby airports");
      }

      const data = await response.json();

      return data.data.nearby.map(
        (airport: any): Airport => ({
          name: airport.presentation.title,
          code: airport.presentation.suggestionTitle
            .split(" ")[1]
            .replace("(", "")
            .replace(")", ""),
          country: airport.presentation.subtitle,
        })
      );
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const nearbyAirportsSlice = createSlice({
  name: "nearbyAirports",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNearbyAirports.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNearbyAirports.fulfilled, (state, action) => {
        state.loading = false;
        state.nearbyAirports = action.payload;
        state.error = null;
      })
      .addCase(fetchNearbyAirports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default nearbyAirportsSlice.reducer;
