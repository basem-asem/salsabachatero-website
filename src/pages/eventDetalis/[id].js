import React, { useState, useEffect } from "react";
import { Box, Text, Icon } from "@chakra-ui/react";
import {
  IoHeartOutline,
  IoArrowBackCircleSharp,
  IoHeartDislike,
} from "react-icons/io5";
import { useRouter } from "next/router";
import ReactPlayer from "react-player";
import { IoIosPin } from "react-icons/io";
import { getDocumentData } from "@/firebase/firebaseutils";
import { FaHeart, FaRegHeart } from "react-icons/fa6";
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { FaArrowCircleLeft } from "react-icons/fa";
import { BsArrowLeftCircleFill } from "react-icons/bs";

// Function to convert location string to Google Maps URL
const goToGMaps = (geoPoint) => {
  if (
    !geoPoint ||
    typeof geoPoint.latitude !== "number" ||
    typeof geoPoint.longitude !== "number"
  ) {
    return null;
  }

  const latitude = geoPoint.latitude;
  const longitude = geoPoint.longitude;

  const location = `${latitude},${longitude}`;
  const url = `https://www.google.com/maps?q=${location}&hl=en`;
  return url;
};

const Index = () => {
  const [images, setImages] = useState(null); // Initially null to differentiate from undefined
  const [isLoading, setIsLoading] = useState(true);
  const [fav, setFav] = useState(false);
  const [isMounted, setIsMounted] = useState(false); // To track client-side rendering
  const router = useRouter();
  const { id } = router.query;

  // Ensure the component is mounted before rendering dynamic data
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          // Fetch event data
          const image = await getDocumentData("events", id);
          setImages(image);
          setIsLoading(false);

          // Fetch user data and check if the event is in the favorites
          const userId = localStorage.getItem("userId");
          if (userId) {
            const userRef = doc(db, "users", userId);
            const userDoc = await getDoc(userRef);

            if (userDoc.exists()) {
              const userData = userDoc.data(); // Fetch user data
              // Check if the current event is in the user's favorites
              console.log(userData.favorites?.includes(id));
              setFav(userData.favorites?.includes(id));
            }
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [id]);

  // If component hasn't mounted on the client yet, return null to prevent SSR mismatch
  if (!isMounted) {
    return null;
  }

  const handleLocationClick = () => {
    const gMapsUrl = goToGMaps(images?.latlng);
    if (gMapsUrl) {
      window.open(gMapsUrl, "_blank"); // Open the Google Maps URL in a new tab
    }
  };
  const addToFavorites = async (eventId) => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      const userRef = doc(db, "users", userId);
      setFav(!fav);
      if (fav == false) {
        try {
          await updateDoc(userRef, {
            favorites: arrayUnion(eventId),
          });
          console.log("Event added to favorites!");
        } catch (error) {
          console.error("Error adding event to favorites: ", error);
        }
      } else {
        try {
          await updateDoc(userRef, {
            favorites: arrayRemove(eventId),
          });
          console.log("Event removed from favorites!");
        } catch (error) {
          console.error("Error removing event from favorites: ", error);
        }
      }
    }
  };
  return (
    <Box
      display="flex"
      flexDirection="column"
      position="relative"
      overflow={"auto"}
      height={"100vh"}
    >
      <Icon
        pos={"absolute"}
        m={3}
        as={BsArrowLeftCircleFill}
        w={8}
        h={8}
        color="#a16aa1"
        cursor={"pointer"}
        onClick={() => router.push("/home")}
      />
      {/* Event Title and Favorite Section */}
      <Box textAlign="center" paddingY={4}>
        <Text
          color="#b42d29"
          textAlign={"center"}
          fontSize={28}
          fontWeight={600}
        >
          Salsabachatero
        </Text>
      </Box>

      {/* Video Section */}
      <Box padding={3} display="flex" justifyContent="center">
        <ReactPlayer
          url={images?.eventVideo || "Loading..."}
          controls
          width="100%"
          height="300px"
        />
      </Box>

      {/* Event Details */}
      <Box
        paddingX={5}
        my={4}
        display={"flex"}
        flexDirection={"column"}
        gap={4}
      >
        <Box display={"flex"} gap={5}>
          <Text color="#b42d29" fontWeight="bold">
            Event Name:
          </Text>
          <Text>{images?.title || "Loading..."}</Text>
        </Box>
        <Box display={"flex"} gap={2}>
          <Text color="#b42d29" fontWeight="bold">
            Event Type:
          </Text>
          <Box display={"flex"} flexDirection={"row"} gap={1}>
            {images?.type.map((typ, i) => (
              <React.Fragment key={i}>
                <Text fontSize="sm">{typ}</Text>
                {i < images.type.length - 1 && <Text>/</Text>}
              </React.Fragment>
            ))}
          </Box>
        </Box>
        {/* Check if images and images.location are defined */}
        <Box display={"flex"} gap={5}>
          <Text color="#b42d29" fontWeight="bold">
            Location:
          </Text>
          <Text
            fontSize="sm"
            color="red"
            textDecorationLine={"underline"}
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="ellipsis"
            display="flex"
            alignItems="center"
            cursor="pointer"
            onClick={handleLocationClick} // Handle location click to open Google Maps
          >
            <Icon as={IoIosPin} w={5} h={5} />{" "}
            {images?.location || "Unknown location"}
          </Text>
        </Box>
        {/* Check if images and event properties are defined */}
        <Box display={"flex"} gap={5}>
          <Text color="#b42d29" fontWeight="bold">
            Price Entry:
          </Text>
          <Text fontSize="sm">
            {images?.event || "TBA"} {images?.currency === "Euro" ? "€" : "$"}
          </Text>
        </Box>
        {/* Check if images and event properties are defined */}
        <Box display={"flex"} gap={5}>
          <Text color="#b42d29" fontWeight="bold">
            Phone:
          </Text>
          <Text fontSize="sm">{images?.phone || " "}</Text>
        </Box>
        {/* Check if images and date properties are defined */}
        <Box display={"flex"} gap={5}>
          <Text color="#b42d29" fontWeight="bold">
            Time:
          </Text>
          <Text fontWeight={700} style={{ fontSize: "12px" }}>
            {images?.date
              ? new Date(images.date.seconds * 1000).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "Loading..."}{" "}
            -{" "}
            {images?.closeDate
              ? new Date(images.closeDate.seconds * 1000).toLocaleString(
                  "en-US",
                  {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )
              : "Loading..."}
          </Text>
        </Box>

        {/* Check if images and description are defined */}
        <Box>
          <Text color="#b42d29" fontWeight="bold">
            Description:
          </Text>
          <Text fontSize="sm">
            {images?.description || "No description available"}
          </Text>
        </Box>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          gap={2}
          bgColor={"#0091fa"}
          borderRadius={"40px"}
          p={2}
          onClick={() => addToFavorites(images.docid)}
        >
          <Icon
            as={fav ? FaHeart : FaRegHeart}
            w={6}
            h={6}
            color="red.400"
            cursor={"pointer"}
          />
          <Text fontSize={16} color="white">
            Add to your favorite
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default Index;
