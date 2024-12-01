import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFlightDetails } from "../redux/slices/flightDetailsSlice";
import { useRouter } from "next/router";
import { RootState } from "../redux/store";
import { remapFlightResponseToLegs } from "../helpers";
import { Box, CircularProgress } from "@mui/material";

type Props = {};

const flightDetails = (props: Props) => {
  const router = useRouter();
  const dispatch = useDispatch<any>();
  const { adults, currency, countryCode, sessionId, itineraryId } =
    router.query as any;

  const { flightDetails, loading, error, legs } = useSelector(
    (state: RootState) => state.flightDetails
  );

  function convertFlightDetails(flightDetails: any) {
    let result: any = [];
    flightDetails?.forEach((segment: any) => {
      let flightSegment = {
        origin: segment.origin.displayCode,
        destination: segment.destination.displayCode,
        date: segment.departure.split("T")[0],
      };
      result.push(flightSegment);
    });
    return result;
  }

  useEffect(() => {
    console.log(legs);
    dispatch(
      fetchFlightDetails({
        legs: convertFlightDetails(legs),
        sessionId,
        itineraryId,
        adults,
        currency,
        locale: "en-US",
        market: "en-US",
        countryCode,
      })
    );
  }, [legs, dispatch]);

  if (!flightDetails?.status) {
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

  return <div>flightDetails</div>;
};

export default flightDetails;
