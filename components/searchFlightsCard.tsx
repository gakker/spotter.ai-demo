import React from "react";
import { useSelector } from "react-redux";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Avatar,
  Stack,
  Button,
} from "@mui/material";
import FlightIcon from "@mui/icons-material/Flight";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { RootState } from "../redux/store";
import { useRouter } from "next/router";

interface FlightCardProps {
  isMobile: boolean;
}

type Props = {};

const SearchFlightsCard = (props: Props) => {
  const flightsData = useSelector((state: RootState) => state.flights.data);
  const flightsDataLoading = useSelector(
    (state: RootState) => state.flights.loading
  );
  const router = useRouter();

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2}>
        {flightsData?.data?.itineraries?.map((flight: any) => (
          <Grid item xs={12} key={flight.id}>
            <Card
              elevation={3}
              sx={{
                borderRadius: 2,
                overflow: "hidden",
                ":hover": { boxShadow: 6 },
              }}
            >
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar
                    alt={flight.legs[0].carriers.marketing[0].name}
                    src={flight.legs[0].carriers.marketing[0].logoUrl}
                    sx={{ width: 48, height: 48 }}
                  />
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {flight.legs[0].origin.city} →{" "}
                      {flight.legs[0].destination.city}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {flight.legs[0].carriers.marketing[0].name}
                    </Typography>
                  </Box>
                </Stack>
                <Box mt={2}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <AccessTimeIcon color="primary" />
                    <Typography variant="body2">
                      {`Duration: ${Math.floor(
                        flight.legs[0].durationInMinutes / 60
                      )}h ${flight.legs[0].durationInMinutes % 60}m`}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={2} alignItems="center" mt={1}>
                    <FlightIcon color="primary" />
                    <Typography variant="body2">
                      {`${flight.legs[0].departure.split("T")[0]} at ${
                        flight.legs[0].departure.split("T")[1]
                      }`}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={2} alignItems="center" mt={1}>
                    <AttachMoneyIcon color="primary" />
                    <Typography variant="body2" fontWeight="bold">
                      {flight.price.formatted}
                    </Typography>
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SearchFlightsCard;
