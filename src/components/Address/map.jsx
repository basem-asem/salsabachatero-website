/**/
'use client';

import { Box } from "@chakra-ui/react";
import { MapComponent } from "./Gmap";
import { MapProvider } from "./map-provider";

// Import necessary modules and functions from external libraries and our own project


// Define a list of libraries to load from the Google Maps API


// Define a function component called MapProvider that takes a children prop
export function AdressMap({setShowplaces,events}) {

  return (<Box id="map-block" maxW={400}>
    <MapProvider>
      <MapComponent setShowplaces={setShowplaces} events={events}/>
    </MapProvider>
        </Box>)
  
}           