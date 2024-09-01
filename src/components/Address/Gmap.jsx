/*Since the map was loaded on client side, 
we need to make this component client rendered as well*/
'use client'

import { Box, Input, List, ListItem } from "@chakra-ui/react";
import { MAP_API_KEY } from "./constant";
//Map component Component from library
import { GoogleMapuseLoadScript,
    GoogleMap,
    MarkerF, } from "@react-google-maps/api";
import { useEffect, useState } from "react";
import usePlacesAutocomplete, {
        getGeocode,
        getLatLng,
      } from 'use-places-autocomplete';
//Map's styling
const defaultMapContainerStyle = {
    width: '100%',
    height:"400px",
    borderRadius: '15px 0px 0px 15px',
};

//K2's coordinates
const defaultMapCenter = {
    lat: 31.205753, 
    lng: 29.924526
}

//Default zoom level, can be adjusted
const defaultMapZoom = 18

//Map options
const defaultMapOptions = {
    zoomControl: true,
    tilt: 0,
    gestureHandling: 'auto',
    mapTypeId: 'roadmap',
};








export let PlacesAutocomplete =( {setMapLoc,setResult} )=>{
    const { value, setValue,suggestions: { status, data },clearSuggestions } = usePlacesAutocomplete(
        {
           // requestOptions: { componentRestrictions: { country: 'UAE' } },
           
          }
    );
    
    const renderSuggestions = () =>{
    console.log("run suggest");
    const handleSelect=(s)=>{
       let pid=s.place_id
       console.log("suggest chossen")
      getGeocode({
        address: s.description,
      })
      .then((results) => {
        console.log(results[0])
        
        let {lat,lng}=getLatLng(results[0])
        setMapLoc({
            lat: lat, 
            lng: lng
        })
        setResult(results[0])
        
        
       
        clearSuggestions();
        console.log("Geocoding results: ", lat,lng);

      })
    }
    return data.map((suggestion) =>{ 
        {console.log(suggestion) }
        return (
       
      <li key={suggestion.place_id}  onClick={()=>{handleSelect(suggestion)}} >
        {/* Render suggestion text */}
        {suggestion.description}
      </li>

    )}
    );
    }

    const handleInput = (e) => {
        // Place a "string" to update the value of the input element
        console.log(data)
        //setValue(e.target.value);
        console.log(e.target.value)
        setValue(e.target.value)
      };
    return (
        <Box>
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
        {/* Render dropdown */}
        {status === "OK" && (
          <List>
            {renderSuggestions().map((suggestion, index) => (
              <ListItem key={index}>
                {suggestion}
              </ListItem>
            ))}
          </List>
        )}
      </Box>
      );
    };

const MapComponent = () => {
        const [mapLoc,setMapLoc]=useState(defaultMapCenter)
        const [address,setAdress]=useState("Alexandria, Eg");
        const [city,setCity]=useState("ALex")
        const [result,setResult]=useState({})
        useEffect(()=>{
            setAdress(result.formatted_address)

            setCity(result.address_components?.filter((ele)=>{
                 return ele.types[0]=="administrative_area_level_1"
            })[0].long_name);
            console.log("city",city)
            //setCity(result.)
        },[result])
        useEffect(()=>{
            document.getElementById("address").value=address
           
        },[address])
        useEffect(()=>{
            document.getElementById("City").value=city

        },[city])
        useEffect(()=>{
            document.getElementById("lat").value=mapLoc.lat
            document.getElementById("lng").value=mapLoc.lng
        },[mapLoc])
        const onMapClick = (event) => {
            console.log('Map clicked:', event.latLng.lat(), event.latLng.lng());
            setMapLoc({
                lat:event.latLng.lat(),
                lng:event.latLng.lng()
            })
            fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${mapLoc.lat},${mapLoc.lng}&key=${MAP_API_KEY}`)
            .then((res)=>res.json())
            .then((res)=>{
                console.log(res.results[0])
                let adrs=res.results[0].formatted_address;
                //setAdress(adrs)
                setResult(res.results[0])
                //document.getElementById("address").value=adrs;

            })
          };
        return (
            <div className="w-full" style={{height:"400px"}}>
                <PlacesAutocomplete setMapLoc={setMapLoc} setResult={setResult}/>
                <GoogleMap
                    mapContainerStyle={defaultMapContainerStyle}
                    center={mapLoc}
                    zoom={defaultMapZoom}
                    options={defaultMapOptions}
                    onClick={onMapClick}
                >
                    <MarkerF position={mapLoc} onLoad={() => console.log('Marker Loaded')} />
                </GoogleMap>
            </div>
        )
    };
    
    export { MapComponent };