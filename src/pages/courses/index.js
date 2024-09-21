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
  const router = useRouter();
  const { courseIds } = router.query;
  const [courses, setCourses] = useState([]);
  useEffect(() => {
    if (courseIds) {
      // Split the courseIds string back into an array
      const courseIdsArray = courseIds.split(',');
      // Fetch or process the event data using the courseIdsArray
      setCourses(courseIdsArray);
    }
  }, [courseIds]);
  console.log(courses)
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
      <Title name={"Home"} />
      <Icon
        pos={"absolute"}
        m={2}
        as={BsArrowLeftCircleFill}
        w={12}
        h={12}
        color="#a16aa1"
        cursor={"pointer"}
        onClick={() => router.push("/home")}
      />
      <Text color="#b42d29" style={{fontSize:"24px"}} fontWeight={600} textAlign={"center"}>
      Dance Courses
      </Text>
      <Box display="flex" flexDirection="row" justifyContent={"center"} gap={5}>
        <Icon as={IoArrowUndoSharp} w={8} h={8} color="black" />
        <Text fontSize={24} fontWeight={500} textAlign={"center"}>
          Swipe
        </Text>
        <Icon as={IoArrowRedoSharp} w={8} h={8} color="black" />
      </Box>
      {/* the center of the page */}
      <ImageGallery events={courses} course/>
    </Box>
  );
};

export default Index;
