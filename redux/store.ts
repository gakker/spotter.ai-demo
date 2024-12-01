import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./themeSlice";
import mapsReducer from "./slices/citySlice";
import nearbyCities from "./slices/cityNearby";
import nearByAirports from "./slices/nearByAirports";
import autoComplete from "./slices/autoComplete";
import searchFlights from "./slices/searchFlights";
import flightDetails from "./slices/flightDetailsSlice";

const store = configureStore({
  reducer: {
    theme: themeReducer,
    maps: mapsReducer,
    cityNearby: nearbyCities,
    nearbyAirports: nearByAirports,
    placesAutocomplete: autoComplete,
    flights: searchFlights,
    flightDetails,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
