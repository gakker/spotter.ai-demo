import React, { useState, useEffect } from "react";
import { Box, Card, Typography, useTheme } from "@mui/material";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { GOOGLE_API_KEY } from "../config";

const MapCard = () => {
  const theme = useTheme();
  const GOOGLE_MAPS_API_KEY = GOOGLE_API_KEY;

  const [mapCenter, setMapCenter] = useState({});

  const mapContainerStyle = {
    width: "100%",
    height: "500px",
  };

  const darkModeStyle = [
    {
      elementType: "geometry",
      stylers: [
        {
          color: "#212121",
        },
      ],
    },
    {
      elementType: "labels.icon",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#ffffff",
        },
      ],
    },
    {
      elementType: "labels.text.stroke",
      stylers: [
        {
          color: "#212121",
        },
      ],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [
        {
          color: "#3c3c3c",
        },
      ],
    },
    {
      featureType: "water",
      elementType: "geometry.fill",
      stylers: [
        {
          color: "#1a1a1a",
        },
      ],
    },
    {
      featureType: "landscape",
      elementType: "geometry.fill",
      stylers: [
        {
          color: "#2f2f2f",
        },
      ],
    },
  ];

  const lightModeStyle: [] = [];

  const mapOptions = {
    styles: theme.palette.mode === "dark" ? darkModeStyle : lightModeStyle,
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setMapCenter({ lat: latitude, lng: longitude });
      });
    }
  }, []);

  return (
    <Box sx={{ width: "100%" }}>
      <Card
        sx={{
          width: "100%",
          height: 500,
          borderRadius: 2,
          boxShadow: theme.palette.mode === "dark" ? 10 : 3,
        }}
      >
        <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={mapCenter}
            zoom={15}
            options={mapOptions}
          >
            <Marker position={mapCenter} />
          </GoogleMap>
        </LoadScript>
      </Card>
    </Box>
  );
};

export default MapCard;
