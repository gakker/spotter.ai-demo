import React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  useMediaQuery,
  Container,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ThemeToggleButton from "./ThemeToggleButton";
import FlightsButton from "./FlightsButton";
import AirplaneTicketIcon from "@mui/icons-material/AirplaneTicket";
import { HotelOutlined, TravelExploreOutlined } from "@mui/icons-material";
import { useRouter } from "next/router";

const Navbar = () => {
  const isMobile = useMediaQuery("(max-width:600px)");
  const router = useRouter();

  return (
    <AppBar
      position="static"
      sx={{
        zIndex: 12,
      }}
      elevation={1}
    >
      <Toolbar>
        {isMobile && (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Box sx={{ display: "flex", gap: 2 }}>
            {!isMobile && (
              <FlightsButton Icon={<HotelOutlined />} label="Hotels" />
            )}
            <FlightsButton
              Icon={<AirplaneTicketIcon />}
              onClick={() => router.push("/")}
              label="Flights"
            />
            {!isMobile && (
              <FlightsButton Icon={<TravelExploreOutlined />} label="Travel" />
            )}
          </Box>
        </Typography>
        <ThemeToggleButton />
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
