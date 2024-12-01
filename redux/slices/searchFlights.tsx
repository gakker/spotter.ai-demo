import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RAPIDAPI_KEY } from "../../config";

const API_HOST = "sky-scrapper.p.rapidapi.com";
const API_KEY = RAPIDAPI_KEY;

interface FetchFlightsParams {
  originSkyId: string;
  destinationSkyId: string;
  originEntityId: string;
  destinationEntityId: string;
  cabinClass: string;
  adults: number;
  sortBy: string;
  currency: string;
  market: string;
  countryCode: string;
}

interface FlightState {
  data: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: FlightState = {
  data: null,
  loading: false,
  error: null,
};

export const fetchFlights = createAsyncThunk(
  "flights/fetchFlights",
  async (params: FetchFlightsParams, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "https://sky-scrapper.p.rapidapi.com/api/v2/flights/searchFlights",
        {
          params,
          headers: {
            "x-rapidapi-host": API_HOST,
            "x-rapidapi-key": API_KEY,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const flightsSlice = createSlice({
  name: "flights",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFlights.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFlights.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchFlights.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default flightsSlice.reducer;
