import React from "react";
import { Button, useTheme } from "@mui/material";

const FlightsButton = ({
  Icon,
  label,
  onClick,
}: {
  Icon: any;
  label: string;
  onClick?: any;
}) => {
  const theme = useTheme();

  return (
    <Button
      variant="contained"
      startIcon={Icon}
      sx={{
        borderRadius: "999px",
        paddingX: 3,
        paddingY: 1,
        backgroundColor: theme.palette.mode === "dark" ? "#2c2c2c" : "#e0e0e0",
        color: theme.palette.text.primary,
        "&:hover": {
          backgroundColor:
            theme.palette.mode === "dark" ? "#3a3a3a" : "#d6d6d6",
        },
      }}
      onClick={onClick}
    >
      {label}
    </Button>
  );
};

export default FlightsButton;
