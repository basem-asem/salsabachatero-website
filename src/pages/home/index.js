import React, { useState, useEffect } from "react";
import useTranslation from "@/hooks/useTranslation";
import { Box, Avatar, Text, Button, Icon, useToast } from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { setUserLocation } from "@/redux/locationSlice";
import Title from "@/components/Title";
import { AdressMap } from "@/components/Address/map";
import { IoIosPin } from "react-icons/io";
import { useRouter } from "next/router";
import { getDistance } from "geolib";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase/firebase";

const Index = () => {
  const { t } = useTranslation();
  const [city, setCity] = useState("");
  const [showplaces, setShowplaces] = useState(true);
  const [userData, setUserData] = useState({});
  const dispatch = useDispatch();
  const toast = useToast();
  const router = useRouter();
  let manImg =
    "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFufGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60";

  useEffect(() => {
    const userDataString = localStorage.getItem("userdata");
    if (userDataString) {
      const parsedUserData = JSON.parse(userDataString);
      setUserData(parsedUserData);
    }
  }, []);

  const handleLocationUpdate = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyDbyqQs6fkB0ZKoVwBDd27042c0FjW1yaQ`
      )
        .then((res) => res.json())
        .then((res) => {
          const cityComponent = res.results[0].address_components?.find(
            (ele) => ele.types[0] === "administrative_area_level_1"
          );
          const cityName = cityComponent?.long_name || "";

          setCity(cityName);
          localStorage.setItem("city", cityName);
          localStorage.setItem("latitude", latitude);
          localStorage.setItem("longitude", longitude);
          dispatch(
            setUserLocation({ lat: latitude, lng: longitude, city: cityName })
          );

          // Show success toast
          toast({
            title: "Location Updated",
            description: `Your location has been updated to ${cityName}.`,
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        });
    });
  };


  async function getEvents(lat, long) {
    try {
      const currentTime = new Date();
  
      // Query events that have a future date
      const eventsQuery = query(
        collection(db, "events"),
        where("date", ">=", currentTime)
      );
      
      const eventsSnapshot = await getDocs(eventsQuery);
      const eventsInRange = [];
  
      // Loop through events and calculate the distance
      eventsSnapshot.forEach((doc) => {
        const eventData = doc.data();
        
        if (eventData.latlng) {
          const eventLocation = {
            latitude: eventData.latlng.latitude,
            longitude: eventData.latlng.longitude,
          };
  
          // Calculate the distance between the event and the user's location
          const distance = getDistance(
            { latitude: lat, longitude: long },
            { latitude: eventLocation.latitude, longitude: eventLocation.longitude }
          );
  
          const km = distance / 1000; // Convert distance to kilometers
  
          // If the event is within 20 kilometers, add its ID to the array
          if (km <= 20) {
            eventsInRange.push(doc.id);
          }
        }
      });
  
      // Return the array of event IDs
      return eventsInRange;
    } catch (error) {
      console.error("Error fetching events:", error);
      return [];
    }
  }
    const handlecontinue = () => {
    const lat = localStorage.getItem("latitude");
    const long = localStorage.getItem("longitude");
    getEvents(lat, long).then((events) => {
      const eventIdsString = events.join(',');

      router.push({
        pathname: '/events', // the target page
        query: { eventIds: eventIdsString },
      });
    });
  };
  return (
    <Box
      display="flex"
      p={10}
      flexDirection="column"
      justifyContent={"center"}
      position="relative"
      overflow={"auto"}
      height={"100vh"}
      gap={15}
      backgroundImage="url('/assets/backgroundImage.png')"
    >
      <Title name={"Home"} />
      <Box
        borderTopRadius={"10px"}
        w="full"
        h={"150px"}
        pos={"absolute"}
        top={0}
        left={0}
      >
        <Avatar size={"md"} src={userData["photo_url"] || manImg} ml={5} />
        <Text fontSize={"18px"} color="white" fontWeight={400} pl={5}>
          {userData["display_name"]}
        </Text>
      </Box>
      <Text
        color="#f9cf58"
        fontSize={30}
        fontWeight={600}
        textAlign={"center"}
      >
        Salsabachatero
      </Text>
      {/* the center of the page */}
      <Box
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        gap={3}
        flexDirection={"column"}
      >
        <Text color="white" fontSize={30} fontWeight={600} textAlign={"center"}>
          Where do you want to dance?
        </Text>
        <Box
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          gap={2}
        >
          {showplaces && (
            <Button
              onClick={() => setShowplaces(!showplaces)}
              borderRadius={"3xl"}
              px={8}
              maxW={"fit-content"}
            >
              Enter your city
            </Button>
          )}
          {!showplaces && <AdressMap setShowplaces={setShowplaces}/>}
          
          <Icon
            as={IoIosPin}
            border={"1px solid #4b39ef"}
            borderRadius={"50%"}
            bgColor={"white"}
            w={8}
            h={8}
            color="black"
            onClick={handleLocationUpdate}
            cursor="pointer"
          />
        </Box>
        <Button
          maxW={"fit-content"}
          px={8}
          borderRadius={"3xl"}
          mx={"auto"}
          onClick={handlecontinue} //() => router.push("/events")
        >
          Continue
        </Button>
      </Box>
      <Box
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        flexDirection={"column"}
        gap={3}
        pt={15}
        mt={20}
      >
        <Text color="white" fontSize={20} fontWeight={500} textAlign={"center"}>
          You can publish your event here
        </Text>
        <Button
          maxW={"fit-content"}
          px={8}
          borderRadius={"3xl"}
          mx={"auto"}
          onClick={() => router.push("/addEvent")}
        >
          Publish your event
        </Button>
        <Button
          maxW={"fit-content"}
          px={8}
          mt={7}
          borderRadius={"3xl"}
          mx={"auto"}
          onClick={() => router.push("/favEvents")}
        >
          Your Favurite events
        </Button>
      </Box>
    </Box>
  );
};

export default Index;
