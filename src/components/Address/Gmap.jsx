'use client';

import { Box, Input, List, ListItem, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete';

// K2's coordinates
const defaultMapCenter = {
  lat: 31.205753,
  lng: 29.924526,
};

export const PlacesAutocomplete = ({ setMapLoc, setResult, setShowplaces,events }) => {
  const { value, setValue, suggestions: { status, data }, clearSuggestions } = usePlacesAutocomplete();
  const [showSuggestions, setShowSuggestions] = useState(true); // Track suggestions visibility

  const renderSuggestions = () => {
    const handleSelect = (s) => {
      getGeocode({ address: s.description })
        .then((results) => {
          if (results.length > 0) {
            let { lat, lng } = getLatLng(results[0]);
            setMapLoc({ lat, lng });
            setResult(results[0]);

            // Get the city name from the result
            const cityComponent = results[0].address_components.find((ele) =>
              ele.types.includes("locality") || ele.types.includes("administrative_area_level_1")
            );
            if (cityComponent) {
              // Update the input with the city name
              setValue(cityComponent.long_name);
            }

            // Hide suggestions and clear them
            setShowSuggestions(false); // Prevent the suggestions from showing again
            clearSuggestions();
          }
        })
        .catch((error) => {
          console.error("Error during geocoding:", error);
        });
    };

    return data.map((suggestion) => (
      <ListItem
        key={suggestion.place_id}
        onClick={() => handleSelect(suggestion)}
        p={2}
        bg="gray.50"
        borderBottom="1px solid #ccc"
        _hover={{ bg: "gray.200", cursor: "pointer" }}
      >
        {suggestion.description}
      </ListItem>
    ));
  };

  const handleInput = (e) => {
    setValue(e.target.value);
    setShowSuggestions(true); // Show suggestions when user types
  };

  return (
    <Box position="relative" width="100%">
      <Input
        value={value}
        onChange={handleInput}
        my={2}
        py={2}
        px={3}
        borderRadius="lg"
        bg="gray.100"
        color="black"
        borderColor="transparent"
        placeholder={
          events === 1
            ? "Enter event address"
            : events === 2
            ? "Enter school address"
            : "Enter your city"
        }
        _placeholder={{ color: 'gray.600' }}
      />
      {status === "OK" && showSuggestions && (
        <List
          position="absolute"
          top="100%" // Position just below the input
          left="0"
          right="0"
          bg="white"
          zIndex="1000"
          maxHeight="200px"
          overflowY="auto"
          borderRadius="md"
          boxShadow="md"
        >
          {renderSuggestions()}
        </List>
      )}
    </Box>
  );
};

const MapComponent = ({ setShowplaces ,events}) => {
  const [mapLoc, setMapLoc] = useState(defaultMapCenter);
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [result, setResult] = useState({});
  const toast = useToast();

  useEffect(() => {
    if (result.formatted_address) {
      setAddress(result.formatted_address);
    }
    if (result.address_components) {
      const cityComponent = result.address_components.find((ele) =>
         ele.types.includes("administrative_area_level_1")
      );
      if (cityComponent) {
        setCity(cityComponent.long_name);
        toast({
          title: "Location Updated",
          description: `Your location has been updated to ${cityComponent.long_name}.`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setShowplaces(true);
      }
    }
  }, [result]);

  useEffect(() => {
    if (city && mapLoc.lat && mapLoc.lng) {

      localStorage.setItem("city", city);
      localStorage.setItem("address", address);
      localStorage.setItem("latitude", mapLoc.lat);
      localStorage.setItem("longitude", mapLoc.lng);
    }
  }, [city, mapLoc]);

  return (
    <div>
      <PlacesAutocomplete setMapLoc={setMapLoc} setResult={setResult} setShowplaces={setShowplaces} events={events}/>
    </div>
  );
};

export { MapComponent };
