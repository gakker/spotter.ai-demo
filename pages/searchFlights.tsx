import React, { useEffect } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  IconButton,
  Paper,
  CircularProgress,
  useMediaQuery,
  MenuItem,
  Select,
} from "@mui/material";
import { FlightTakeoff, FlightLand } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useRouter } from "next/router";
import { fetchFlights } from "../redux/slices/searchFlights";
import SearchFlightsCard from "../components/searchFlightsCard";
import { setLegs } from "../redux/slices/flightDetailsSlice";
import { clearSuggestions } from "../redux/slices/autoComplete";

const SORTING_OPTIONS = [
  { value: "best", label: "Best" },
  { value: "price_high", label: "Cheapest" },
  { value: "fastest", label: "Fastest" },
  { value: "outbound_take_off_time", label: "Outbound Take Off Time" },
  { value: "outbound_landing_time", label: "Outbound Landing Time" },
  { value: "return_take_off_time", label: "Return Take Off Time" },
  { value: "return_landing_time", label: "Return Landing Time" },
];

const SearchFlights: React.FC = () => {
  const flightsData = useSelector((state: RootState) => state.flights.data);
  const flightsDataLoading = useSelector(
    (state: RootState) => state.flights.loading
  );
  const isMobile = useMediaQuery("(max-width:600px)");
  const router = useRouter();
  const dispatch = useDispatch<any>();
  const {
    originSkyId,
    destinationSkyId,
    originEntityId,
    destinationEntityId,
    cabinClass,
    adults,
    date,
    returnDate,
    sortBy = "best",
    currency,
    market,
    countryCode,
  } = router.query as any;

  useEffect(() => {
    dispatch(
      fetchFlights({
        originSkyId,
        destinationSkyId,
        originEntityId,
        destinationEntityId,
        cabinClass,
        adults,
        date,
        returnDate,
        sortBy,
        currency,
        market,
        countryCode,
      })
    );
  }, [router.query]);

  const handleSortChange = (newSortBy: string) => {
    const queryParams = {
      ...router.query,
      sortBy: newSortBy,
    };

    router.push({
      pathname: router.pathname,
      query: queryParams,
    });
  };

  const navigateToFlightDetails = (
    legs: any,
    itineraryId: any,
    sessionId: any
  ) => {
    dispatch(setLegs(legs));
    const queryParams = {
      sessionId,
      itineraryId,
      adults,
      currency,
      locale: "en-US",
      market: "en-US",
      countryCode,
    };

    router.push({
      pathname: "/flightDetails",
      query: queryParams,
    });
  };

  if (flightsDataLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress size={50} />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Button
          variant="outlined"
          onClick={() => {
            dispatch(clearSuggestions());
            router.back();
          }}
        >
          Go Back
        </Button>
        <Select
          value={sortBy}
          onChange={(e) => handleSortChange(e.target.value)}
          variant="outlined"
          size="small"
        >
          {SORTING_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </Box>

      {isMobile ? (
        <SearchFlightsCard />
      ) : (
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Origin</TableCell>
                <TableCell>Destination</TableCell>
                <TableCell>Carrier</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Stops</TableCell>
                <TableCell>Price</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {flightsData?.data?.itineraries?.map((itinerary: any) => {
                const leg = itinerary.legs[0];
                const {
                  origin,
                  destination,
                  durationInMinutes,
                  stopCount,
                  carriers,
                } = leg;
                const marketingCarrier = carriers.marketing[0];
                return (
                  <TableRow
                    key={itinerary.id}
                    hover
                    sx={{
                      transition: "background-color 0.3s",
                      "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
                    }}
                  >
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <IconButton>
                          <FlightTakeoff />
                        </IconButton>
                        <Box ml={1}>
                          <Typography variant="body1">{origin.city}</Typography>
                          <Typography variant="body2" color="textSecondary">
                            {origin.displayCode}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <IconButton>
                          <FlightLand />
                        </IconButton>
                        <Box ml={1}>
                          <Typography variant="body1">
                            {destination.city}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {destination.displayCode}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <img
                          src={marketingCarrier.logoUrl}
                          alt={marketingCarrier.name}
                          style={{ width: 32, height: 32, marginRight: 8 }}
                        />
                        <Typography>{marketingCarrier.name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{`${Math.floor(durationInMinutes / 60)}h ${
                      durationInMinutes % 60
                    }m`}</TableCell>
                    <TableCell>
                      {stopCount === 0 ? "Direct" : `${stopCount} Stop(s)`}
                    </TableCell>
                    <TableCell>
                      <Typography variant="h6" color="primary">
                        {itinerary.price.formatted}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() =>
                          navigateToFlightDetails(
                            itinerary.legs,
                            itinerary.id,
                            flightsData.sessionId
                          )
                        }
                      >
                        See Details
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default SearchFlights;
