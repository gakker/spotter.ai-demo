import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RAPIDAPI_KEY } from "../../config";

const RAPIDAPI_HOST = "sky-scrapper.p.rapidapi.com";

interface FlightDetailsState {
  flightDetails: any | null;
  loading: boolean;
  error: string | null;
  legs: any;
}

const initialState: FlightDetailsState = {
  flightDetails: null,
  loading: false,
  error: null,
  legs: null,
};

export const fetchFlightDetails = createAsyncThunk(
  "flightDetails/fetchFlightDetails",
  async (
    {
      legs,
      sessionId,
      itineraryId,
      adults = 1,
      currency = "USD",
      locale = "en-US",
      market = "en-US",
      countryCode = "US",
    }: {
      legs: any[];
      sessionId: any;
      itineraryId: any;
      adults?: number;
      currency?: string;
      locale?: string;
      market?: string;
      countryCode?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get(
        `https://${RAPIDAPI_HOST}/api/v1/flights/getFlightDetails`,
        {
          params: {
            sessionId,
            itineraryId,
            legs,
            adults,
            currency,
            locale,
            market,
            countryCode,
          },
          headers: {
            "x-rapidapi-host": RAPIDAPI_HOST,
            "x-rapidapi-key": RAPIDAPI_KEY,
          },
        }
      );

      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error("Failed to fetch flight details");
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const flightDetailsSlice = createSlice({
  name: "flightDetails",
  initialState,
  reducers: {
    clearFlightDetails: (state) => {
      state.flightDetails = null;
      state.loading = false;
      state.error = null;
    },
    setLegs: (state, action: PayloadAction<any>) => {
      state.legs = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFlightDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchFlightDetails.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.flightDetails = action.payload;
          state.loading = false;
        }
      )
      .addCase(
        fetchFlightDetails.rejected,
        (state, action: PayloadAction<any>) => {
          state.error = action.payload || "Something went wrong";
          state.loading = false;
        }
      );
  },
});

export const { clearFlightDetails, setLegs } = flightDetailsSlice.actions;
export default flightDetailsSlice.reducer;
