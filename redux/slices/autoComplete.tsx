import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RAPIDAPI_KEY } from "../../config";

interface Place {
  name: string;
  code: string;
}

interface AutocompleteState {
  suggestions: Place[];
  loading: boolean;
  error: string | null;
  initialOrigin: any;
}

const initialState: AutocompleteState = {
  suggestions: [],
  loading: false,
  error: null,
  initialOrigin: null,
};

export const fetchAutocompleteSuggestions = createAsyncThunk(
  "placesAutocomplete/fetchAutocompleteSuggestions",
  async (query: string | null, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchAirport",
        {
          params: { query },
          headers: {
            "X-RapidAPI-Key": RAPIDAPI_KEY!,
            "X-RapidAPI-Host": "sky-scrapper.p.rapidapi.com",
          },
        }
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const placesAutocompleteSlice = createSlice({
  name: "placesAutocomplete",
  initialState,
  reducers: {
    clearSuggestions: (state) => {
      state.suggestions = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAutocompleteSuggestions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAutocompleteSuggestions.fulfilled, (state, action) => {
        state.loading = false;
        state.suggestions = action.payload;
        state.initialOrigin = state.suggestions[0];
        state.error = null;
      })
      .addCase(fetchAutocompleteSuggestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSuggestions } = placesAutocompleteSlice.actions;
export default placesAutocompleteSlice.reducer;
