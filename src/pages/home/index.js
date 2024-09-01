import React, { useState, useEffect } from "react";
import useTranslation from "@/hooks/useTranslation";
import { Box, Avatar, Text, Button, Icon, useToast } from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { setUserLocation } from "@/redux/locationSlice";
import Title from "@/components/Title";
import { AdressMap } from "@/components/Address/map";
import { IoIosPin } from "react-icons/io";
import { useRouter } from "next/router";

const Index = () => {
  const { t } = useTranslation();
  const [city, setCity] = useState("");
  const [showplaces, setShowplaces] = useState(true);
  const [userData, setUserData] = useState({});
  const dispatch = useDispatch();
  const toast = useToast();
const router = useRouter()
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
      background="linear-gradient(180deg, rgba(75, 57, 239, 1) 30%, rgba(238, 139, 96, 1) 100%)"
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
        <Avatar size={"2xl"} src={userData["photo_url"] || manImg} />
        <Text fontSize={"20px"} my="1" fontWeight={400} pl={8}>
          {userData["display_name"]}
        </Text>
      </Box>
      <Text
        color="#f9cf58"
        fontSize={30}
        fontWeight={600}
        textAlign={"center"}
        pos={"absolute"}
        top={10}
        right={"50%"}
        style={{ transform: "translate(50%)" }}
      >
        Salsabachatero
      </Text>
      <Text color="white" fontSize={30} fontWeight={600} textAlign={"center"}>
        Where do you want to dance?
      </Text>
      <Box display={"flex"} justifyContent={"center"} alignItems={"center"} gap={3}>
        {showplaces && (
          <Button onClick={() => setShowplaces(!showplaces)} borderRadius={"3xl"} px={8}>
            Enter your city
          </Button>
        )}
        {!showplaces && <AdressMap />}
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
      <Button maxW={150} px={8} borderRadius={"3xl"} mx={"auto"} onClick={() => router.push("/")}>Continue</Button>
    </Box>
  );
};

export default Index;
