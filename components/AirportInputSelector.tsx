import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  Typography,
  Grid,
  Collapse,
  Button,
  IconButton,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  Autocomplete,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import EventIcon from "@mui/icons-material/Event";
import PeopleIcon from "@mui/icons-material/People";
import FlightClassIcon from "@mui/icons-material/FlightClass";
import AirplaneTicketOutlined from "@mui/icons-material/AirplaneTicketOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { useDispatch, useSelector } from "react-redux";
import {
  clearSuggestions,
  fetchAutocompleteSuggestions,
} from "../redux/slices/autoComplete";
import { RootState } from "../redux/store";
import { fetchFlights } from "../redux/slices/searchFlights";
import { useRouter } from "next/router";
import { getCurrencyByCountry } from "../helpers";

interface PeopleCount {
  adults: number;
  children: number;
  infants: number;
}

const AirplaneInputSelector: React.FC = () => {
  const [isTripTypeOpen, setTripTypeOpen] = useState<boolean>(false);
  const [isPeopleOpen, setPeopleOpen] = useState<boolean>(false);
  const [isClassOpen, setClassOpen] = useState<boolean>(false);

  const [tripType, setTripType] = useState<string>("Round Trip");
  const [travelClass, setTravelClass] = useState<string>("Economy");
  const [peopleCount, setPeopleCount] = useState<PeopleCount>({
    adults: 1,
    children: 0,
    infants: 0,
  });

  const dispatch = useDispatch<any>();
  const { suggestions, loading, initialOrigin } = useSelector(
    (state: RootState) => state.placesAutocomplete
  );
  const { name } = useSelector((state: RootState) => state.maps);

  const [queryFrom, setQueryFrom] = useState<string>("");
  const [queryWhere, setQueryWhere] = useState<string>("");
  const [departureDate, setDepartureDate] = useState<string>("");
  const [returnDate, setReturnDate] = useState<string>("");
  const [originData, setoriginData] = useState<any>(null);
  const [destinationData, setdestinationData] = useState<any>(null);

  const isFindButtonDisabled =
    !queryFrom ||
    !queryWhere ||
    !departureDate ||
    (tripType === "Round Trip" && !returnDate);

  const router = useRouter();

  // console.log(originData, destinationData);
  const { name: city, country } = useSelector((state: RootState) => state.maps);
  const currency = getCurrencyByCountry(country || "US");
  const isMobile = useMediaQuery("(max-width:600px)");

  const handleSearch = () => {
    router.push(
      `/searchFlights?originSkyId=${originData?.skyId}&destinationSkyId=${
        destinationData?.skyId
      }&originEntityId=${originData?.entityId}&destinationEntityId=${
        destinationData?.entityId
      }&cabinClass=${travelClass.toLowerCase()}&adults=${
        peopleCount.adults
      }&date=${departureDate}&returnDate=${returnDate}&sortBy=best&currency=${currency}&market=en-US&countryCode=${country}&childrens=${
        peopleCount.children
      }&infants=${peopleCount?.infants}`
    );
  };

  const renderSuggestion = (option: any) => {
    const isAirport = option.navigation.entityType === "AIRPORT";
    return (
      <ListItem disableGutters>
        <ListItemIcon>
          {isAirport ? (
            <AirplaneTicketOutlined color="primary" />
          ) : (
            <LocationOnIcon color="secondary" />
          )}
        </ListItemIcon>
        <ListItemText
          primary={
            <Typography variant="body1" color="text.primary">
              {option.presentation.title}
            </Typography>
          }
          secondary={
            <Typography variant="body2" color="text.secondary">
              {option.presentation.subtitle}
            </Typography>
          }
        />
      </ListItem>
    );
  };

  useEffect(() => {
    if (name) {
      dispatch(fetchAutocompleteSuggestions(name));
    }
  }, [name, dispatch]);

  // console.log(originData);
  // console.log(destinationData);

  return (
    <>
      <Card
        sx={{
          padding: 3,
          borderRadius: 2,
          backgroundColor: (theme) =>
            theme.palette.mode === "dark" ? "#2c2c2c" : "#ffffff",
          boxShadow: 3,
          margin: "auto",
          position: "relative",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: 2,
            marginBottom: 2,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Button
              fullWidth
              startIcon={<SyncAltIcon />}
              endIcon={<ExpandMoreIcon />}
              onClick={() => setTripTypeOpen(!isTripTypeOpen)}
              sx={{ justifyContent: "space-between" }}
            >
              {tripType}
            </Button>
            <Collapse in={isTripTypeOpen}>
              <RadioGroup
                value={tripType}
                onChange={(e) => setTripType(e.target.value)}
                sx={{ paddingLeft: 3, marginTop: 1 }}
              >
                <FormControlLabel
                  value="Round Trip"
                  control={<Radio />}
                  label="Round Trip"
                />
                <FormControlLabel
                  value="One-Way"
                  control={<Radio />}
                  label="One-Way"
                />
              </RadioGroup>
            </Collapse>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Button
              fullWidth
              startIcon={<PeopleIcon />}
              endIcon={<ExpandMoreIcon />}
              onClick={() => setPeopleOpen(!isPeopleOpen)}
              sx={{ justifyContent: "space-between" }}
            >
              {`${
                peopleCount.adults + peopleCount.children + peopleCount.infants
              }`}
            </Button>
            <Collapse in={isPeopleOpen}>
              <Box sx={{ paddingLeft: 3, marginTop: 1 }}>
                {["adults", "children", "infants"].map((type) => (
                  <Box
                    key={type}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 1,
                    }}
                  >
                    <Typography sx={{ textTransform: "capitalize" }}>
                      {type}
                    </Typography>
                    <Box>
                      <IconButton
                        onClick={() =>
                          setPeopleCount((prev) => ({
                            ...prev,
                            [type]: Math.max(
                              0,
                              prev[type as keyof PeopleCount] - 1
                            ),
                          }))
                        }
                      >
                        -
                      </IconButton>
                      <Typography component="span" sx={{ marginX: 1 }}>
                        {peopleCount[type as keyof PeopleCount]}
                      </Typography>
                      <IconButton
                        onClick={() =>
                          setPeopleCount((prev) => ({
                            ...prev,
                            [type]: prev[type as keyof PeopleCount] + 1,
                          }))
                        }
                      >
                        +
                      </IconButton>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Collapse>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Button
              fullWidth
              startIcon={<FlightClassIcon />}
              endIcon={<ExpandMoreIcon />}
              onClick={() => setClassOpen(!isClassOpen)}
              sx={{ justifyContent: "space-between" }}
            >
              {travelClass}
            </Button>
            <Collapse in={isClassOpen}>
              <RadioGroup
                value={travelClass}
                onChange={(e) => setTravelClass(e.target.value)}
                sx={{ paddingLeft: 3, marginTop: 1 }}
              >
                <FormControlLabel
                  value="economy"
                  control={<Radio />}
                  label="Economy"
                />
                <FormControlLabel
                  value="premium_economy"
                  control={<Radio />}
                  label="Premium Economy"
                />
                <FormControlLabel
                  value="business"
                  control={<Radio />}
                  label="Business"
                />
                <FormControlLabel
                  value="first"
                  control={<Radio />}
                  label="First Class"
                />
              </RadioGroup>
            </Collapse>
          </Box>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Autocomplete
              inputValue={queryFrom}
              onChange={(e, value: any) => setQueryFrom(value)}
              onInputChange={(e, value) => {
                setQueryFrom(value);
                if (value.length > 1) {
                  dispatch(fetchAutocompleteSuggestions(value));
                  setoriginData(suggestions.length > 0 && suggestions[0]);
                }
              }}
              options={suggestions}
              getOptionLabel={(option: any) => option.presentation.title || ""}
              isOptionEqualToValue={(option: any, value: any) =>
                option.presentation.title === value
              }
              noOptionsText={loading ? "Loading..." : "No options"}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  {renderSuggestion(option)}
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="From"
                  variant="outlined"
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: <LocationOnIcon sx={{ mr: 1 }} />,
                  }}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Autocomplete
              inputValue={queryWhere}
              onChange={(e, value: any) => {
                if (value.length > 1) {
                  setQueryWhere(value);
                } else {
                  dispatch(clearSuggestions());
                }
              }}
              onInputChange={(e, value) => {
                setQueryWhere(value);
                if (value.length > 1) {
                  dispatch(fetchAutocompleteSuggestions(value));
                  setdestinationData(suggestions.length > 0 && suggestions[0]);
                } else {
                  dispatch(clearSuggestions());
                }
              }}
              options={suggestions}
              getOptionLabel={(option: any) => option.presentation.title || ""}
              isOptionEqualToValue={(option: any, value: any) =>
                option.presentation.title === value
              }
              noOptionsText={loading ? "Loading..." : "No options"}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  {renderSuggestion(option)}
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Where"
                  variant="outlined"
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: <SyncAltIcon sx={{ mr: 1 }} />,
                  }}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Departure"
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                startAdornment: <EventIcon sx={{ mr: 1 }} />,
              }}
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
            />
          </Grid>
          {tripType === "Round Trip" && (
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Return"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  startAdornment: <EventIcon sx={{ mr: 1 }} />,
                }}
                value={returnDate}
                disabled={tripType !== "Round Trip"}
                onChange={(e) => setReturnDate(e.target.value)}
              />
            </Grid>
          )}
        </Grid>
      </Card>
      <Box
        sx={{
          display: "flex",
          paddingY: 2,
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Button
          variant="contained"
          color="primary"
          disabled={isFindButtonDisabled}
          startIcon={<SearchIcon />}
          sx={{
            boxShadow: 3,
          }}
          onClick={handleSearch}
        >
          Find
        </Button>
      </Box>
    </>
  );
};

export default AirplaneInputSelector;
