import React, { useState, useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import { useDispatch } from "react-redux";
import { fetchCityFromCoords } from "../redux/slices/citySlice";
import { fetchNearbyCities } from "../redux/slices/cityNearby";
import { fetchNearbyAirports } from "../redux/slices/nearByAirports";

const GeolocationComponent = () => {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch<any>();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          dispatch(
            fetchCityFromCoords({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            })
          );
          dispatch(
            fetchNearbyCities({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            })
          );
          dispatch(
            fetchNearbyAirports({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            })
          );
        },
        (err) => {
          setError("Failed to retrieve location.");
          console.error("Error code: " + err.code + ", " + err.message);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, []);

  return <></>;
};

export default GeolocationComponent;
