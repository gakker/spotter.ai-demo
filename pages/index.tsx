import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { Box, Button, Container, Typography, useTheme } from "@mui/material";
import AirplaneInputSelector from "../components/AirportInputSelector";
import GeolocationComponent from "../components/GeoLocation";
import MapCard from "../components/MapsView";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useEffect } from "react";
import { fetchCityFromCoords } from "../redux/slices/citySlice";
import { fetchNearbyAirports } from "../redux/slices/nearByAirports";
import { grey } from "@mui/material/colors";
import { getCurrencyByCountry } from "../helpers";

const Home: NextPage = () => {
  const theme = useTheme();
  const dispatch = useDispatch<any>();

  const { nearbyCities } = useSelector((state: RootState) => state.cityNearby);
  const { nearbyAirports } = useSelector(
    (state: RootState) => state.nearbyAirports
  );

  const { name, country, loading, error } = useSelector(
    (state: RootState) => state.maps
  );
  const currency = getCurrencyByCountry(country || "US");

  return (
    <Container>
      <img
        src={
          theme.palette.mode === "dark"
            ? "https://www.gstatic.com/travel-frontend/animation/hero/flights_nc_dark_theme_4.svg"
            : "https://www.gstatic.com/travel-frontend/animation/hero/flights_nc_4.svg"
        }
        style={{
          width: "100%",
        }}
      />
      <Typography
        textAlign={"center"}
        style={{
          fontSize: 54,
          fontWeight: "bold",
        }}
      >
        Flights
      </Typography>
      <AirplaneInputSelector />
      <Box>
        <Typography
          sx={{
            paddingY: 3,
          }}
          variant="h6"
        >
          Find cheap flights from {name} to anywhere
        </Typography>
        <Box sx={{ paddingBottom: 3, marginy: 1, gap: 1 }}>
          {nearbyAirports?.map(
            (airport: any, index: number) =>
              index < 5 && (
                <Button
                  sx={{
                    backgroundColor:
                      theme.palette.mode === "dark" ? grey[800] : grey[200],
                    marginRight: 1,
                    marginTop: 1,
                  }}
                >
                  {airport?.name}
                </Button>
              )
          )}
        </Box>
      </Box>
      <MapCard />
      <GeolocationComponent />
    </Container>
  );
};

export default Home;
