'use client';

import { Box, Button, Input, List, ListItem, useToast } from "@chakra-ui/react";
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

export let PlacesAutocomplete = ({ setMapLoc, setResult ,setShowplaces}) => {
  const { value, setValue, suggestions: { status, data }, clearSuggestions } = usePlacesAutocomplete();

  const renderSuggestions = () => {
    console.log("run suggest");

    const handleSelect = (s) => {
      let pid = s.place_id;
      console.log("suggest chosen");
      
      getGeocode({
        address: s.description,
      })
      .then((results) => {
        console.log(results[0]);
        
        let { lat, lng } = getLatLng(results[0]);
        setMapLoc({
          lat: lat,
          lng: lng,
        });
        setResult(results[0]);

        clearSuggestions();
        console.log("Geocoding results: ", lat, lng);
      });
    };

    return data.map((suggestion) => (
      <p key={suggestion.place_id} onClick={() => { handleSelect(suggestion); }}>
        {suggestion.description}
      </p>
    ));
  };

  const handleInput = (e) => {
    console.log(data);
    console.log(e.target.value);
    setValue(e.target.value);
  };

  return (
    <Box
      position="fixed" // Fixed position to ensure it stays in the middle
      top="50%"        // Center vertically
      left="50%"       // Center horizontally
      transform="translate(-50%, -50%)" // Offset by 50% to achieve perfect centering
      zIndex="1000"    // Make sure it pops up over everything else
      bgColor="#00000052"       // Background color for the popup
      p={4}            // Padding for spacing
      borderRadius="md" // Rounded corners
      boxShadow="lg"   // Shadow for popup effect
      w="100%"          // Width of the popup
      h="100%"
      display={"flex"}
      justifyContent="center"
      alignItems="center"
      gap={2}
      flexDirection={"column"}

    >
      <Box w={["100%","50%"]} textAlign={"center"} display={"flex"} alignItems={"center"}>

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
        _placeholder={{ color: 'gray.300' }}
        />
        <Button ml={5} onClick={() => setShowplaces(true)}>
          Close
        </Button>
        </Box>
      {status === "OK" && (
        <List w={["100%","50%"]} >
          {renderSuggestions().map((suggestion, index) => (
            <ListItem
              key={index}
              w="100%"
              p={2}
              borderRadius={"8px"}
              bg="gray.50"
              borderBottom="1px solid #ccc"
              _hover={{ bg: "gray.200", cursor: "pointer" }}
            >
              {suggestion}
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

const MapComponent = ({setShowplaces}) => {
  const [mapLoc, setMapLoc] = useState(defaultMapCenter);
  const [address, setAddress] = useState("Alexandria, Eg");
  const [city, setCity] = useState("Alex");
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

  // Log city whenever it changes
  useEffect(() => {
    if (city) {
      localStorage.setItem("city", city);
      localStorage.setItem("latitude", mapLoc.lat);
      localStorage.setItem("longitude", mapLoc.lng);
    }
  }, [city]);

  return (
    <div>
      <PlacesAutocomplete setMapLoc={setMapLoc} setResult={setResult} setShowplaces={setShowplaces}/>
    </div>
  );
};

export { MapComponent };
