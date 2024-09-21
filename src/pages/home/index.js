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
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { reload } from "firebase/auth";
import { FaHeart, FaRegHeart } from "react-icons/fa6";

const Index = () => {
  const { t } = useTranslation();
  const [city, setCity] = useState("");
  const [showplaces, setShowplaces] = useState(true);
  const [userData, setUserData] = useState({});
  const dispatch = useDispatch();
  const toast = useToast();
  const router = useRouter();
  const [selectedTypes, setSelectedTypes] = useState([]); // Manage selected dance types
  const danceTypes = ["Salsa", "Bachata", "Kizomba"];

  // Toggle the selection of a dance type
  const handleSelectType = (type) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter((item) => item !== type)); // Remove type if already selected
    } else {
      setSelectedTypes([...selectedTypes, type]); // Add type if not selected
    }
    console.log(selectedTypes);
  };
  let manImg =
  "https://media.istockphoto.com/id/1354776457/vector/default-image-icon-vector-missing-picture-page-for-website-design-or-mobile-app-no-photo.jpg?s=612x612&w=0&k=20&c=w3OW0wX3LyiFRuDHo9A32Q0IUMtD4yjXEvQlqyYk9O4=";

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
        where("date", ">=", currentTime),
        where("type", "array-contains-any", selectedTypes.length > 0 ? selectedTypes : danceTypes)
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
            {
              latitude: eventLocation.latitude,
              longitude: eventLocation.longitude,
            }
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
  async function getCourses(lat, long) {
    try {
      const currentTime = new Date();

      // Query events that have a future date
      const eventsQuery = query(
        collection(db, "courses"),
        where("date", ">=", currentTime),
        // where("type", "array-contains-any", selectedTypes)
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
            {
              latitude: eventLocation.latitude,
              longitude: eventLocation.longitude,
            }
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
      const eventIdsString = events.join(",");

      router.push({
        pathname: "/events", // the target page
        query: { eventIds: eventIdsString },
      });
    });
  };
  const handleSearchCourses = () => {
    const lat = localStorage.getItem("latitude");
    const long = localStorage.getItem("longitude");
    getCourses(lat, long).then((courses) => {
      const courseIdsString = courses.join(",");

      router.push({
        pathname: "/courses", // the target page
        query: { courseIds: courseIdsString },
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
        w="auto"
        h={"150px"}
        pos={"absolute"}
        top={0}
        left={0}
        ml={2}
        display={"flex"}
        alignItems={"center"}
        flexDirection={"column"}
        onClick={()=> router.push("/profile")}
      >
        <Avatar size={"md"} src={userData["photo_url"] || manImg}  mt={2} />
        <Text fontSize={"18px"} color="white" fontWeight={400}  textAlign={"center"}>
          {userData["display_name"]}
        </Text>
      </Box>
      {/* <Text
        color="#f9cf58"
        style={{ fontSize: "28px" }}
        fontWeight={600}
        textAlign={"center"}
      >
        Salsabachatero
      </Text> */}
      {/* the center of the page */}
      <Box
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        gap={3}
        flexDirection={"column"}
      >
        <Text
          color="white"
          style={{ fontSize: "20px" }}
          fontWeight={600}
          textAlign={"center"}
        >
          Choose your favourite type
        </Text>
        <Box display="flex" gap={3}>
          {danceTypes.map((type) => (
            <Box
              key={type}
              onClick={() => handleSelectType(type)}
              cursor="pointer"
              borderRadius="50%"
              p={4}
              bg={selectedTypes.includes(type) ? "lightgreen" : "#add8e6"}
              display="flex"
              justifyContent="center"
              alignItems="center"
              width="70px"
              height="70px"
              color="black"
              fontWeight={600}
              style={{ fontSize: "14px" }}
              transition="background-color 0.3s ease"
            >
              {type}
            </Box>
          ))}
        </Box>
        <Text
          color="white"
          style={{ fontSize: "20px" }}
          fontWeight={600}
          textAlign={"center"}
        >
          Where do you want to dance?
        </Text>
        <Box
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          gap={2}
          pos={"relative"}
        >
          {/* {showplaces && (
            <Button
              onClick={() => setShowplaces(!showplaces)}
              borderRadius={"3xl"}
              px={8}
              maxW={"fit-content"}
            >
              Enter your city
            </Button>
          )} */}
          <AdressMap setShowplaces={setShowplaces} />

          <Icon
            as={IoIosPin}
            border={"1px solid #4b39ef"}
            borderRadius={"50%"}
            bgColor={"#c4ecff"}
            w={8}
            h={8}
            color="black"
            onClick={handleLocationUpdate}
            cursor="pointer"
          />
        </Box>
        <Box
          display={"flex"}
          flexWrap={"nowrap"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Button
            h={"auto"}
            px={4}
            py={4}
            borderRadius={"3xl"}
            mx={"auto"}
            mr={4}
            bgColor={"#c4ecff"}
            whiteSpace={"break-spaces"}
            onClick={handleSearchCourses} //() => router.push("/events")
          >
            Find dance courses
          </Button>
          <Button
            h={"auto"}
            maxW={"fit-content"}
            px={8}
            py={4}
            borderRadius={"3xl"}
            mx={"auto"}
            bgColor={"#c4ecff"}
            onClick={handlecontinue} //() => router.push("/events")
          >
            Continue
          </Button>
        </Box>
      </Box>
      <Box
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        flexDirection={"column"}
        gap={3}
        pt={15}
        mt={"10"}
      >
        <Button
          maxW={"fit-content"}
          px={8}
          borderRadius={"3xl"}
          mx={"auto"}
          bgColor={"#c4ecff"}
          onClick={() => router.push("/addEvent")}
        >
          Publish your Event here
        </Button>
        <Button
          maxW={"fit-content"}
          px={8}
          borderRadius={"3xl"}
          mx={"auto"}
          bgColor={"#c4ecff"}
          onClick={() => router.push("/addCourse")}
        >
          Publish your Courses here
        </Button>
        <Button
          maxW={"fit-content"}
          px={8}
          borderRadius={"3xl"}
          mx={"auto"}
          bgColor={"#c4ecff"}
          onClick={() => router.push("/favEvents")}
          gap={2}
        >
          <Icon as={FaRegHeart} w={6} h={6} color="red.400" /> Your favourite
          Events
        </Button>
      </Box>
    </Box>
  );
};

export default Index;
