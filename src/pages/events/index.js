import React, { useState, useEffect } from "react";
import useTranslation from "@/hooks/useTranslation";
import { Box, Avatar, Text, Button, Icon, useToast } from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { setUserLocation } from "@/redux/locationSlice";
import Title from "@/components/Title";
import { useRouter } from "next/router";
import ImageGallery from "@/components/comman/ImageGallery";
import { IoArrowRedoSharp } from "react-icons/io5";
import { IoArrowUndoSharp } from "react-icons/io5";
import { BsArrowLeftCircleFill } from "react-icons/bs";

const Index = () => {
  const { t } = useTranslation();
  const [city, setCity] = useState("");
  const [showplaces, setShowplaces] = useState(true);
  const [userData, setUserData] = useState({});
  const dispatch = useDispatch();
  const toast = useToast();
  const router = useRouter();
  const { eventIds } = router.query;
  const [events, setEvents] = useState([]);
  useEffect(() => {
    if (eventIds) {
      // Split the eventIds string back into an array
      const eventIdsArray = eventIds.split(',');
console.log(eventIdsArray);
      // Fetch or process the event data using the eventIdsArray
      setEvents(eventIdsArray);
    }
  }, [eventIds]);
  
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
          localStorage.getItem("city");
          localStorage.getItem("latitude");
          localStorage.getItem("longitude");
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

  return (
    <Box
      display="flex"
      flexDirection="column"
      position="relative"
      overflow={"auto"}
      height={"100vh"}
      gap={5}
      mx={5}
    >
      <Title name={"Events"} />
      <Icon
        pos={"absolute"}
        m={2}
        as={BsArrowLeftCircleFill}
        w={12}
        h={12}
        color="#a16aa1"
        cursor={"pointer"}
        onClick={() => router.push("/")}
      />
      <Text color="#b42d29" style={{fontSize:"24px"}} fontWeight={600} textAlign={"center"}>
      Dance Events
      </Text>
      <Box display="flex" flexDirection="row" justifyContent={"center"} gap={5}>
        <Icon as={IoArrowUndoSharp} w={8} h={8} color="black" />
        <Text fontSize={24} fontWeight={500} textAlign={"center"}>
          Swipe
        </Text>
        <Icon as={IoArrowRedoSharp} w={8} h={8} color="black" />
      </Box>
      {/* the center of the page */}
      <ImageGallery events={events}/>
    </Box>
  );
};

export default Index;
