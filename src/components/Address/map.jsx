/**/
'use client';

import { MapComponent } from "./Gmap";
import { MapProvider } from "./map-provider";

// Import necessary modules and functions from external libraries and our own project


// Define a list of libraries to load from the Google Maps API


// Define a function component called MapProvider that takes a children prop
export function AdressMap() {

  return (<div id="map-block" style={{display:"block",height:"450px", marginTop:"5px",transition:"height 3s"}}>
    <MapProvider>
      <MapComponent/>
    </MapProvider>
        </div>)
  
}           