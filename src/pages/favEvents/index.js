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

const Index = () => { 
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

      <Text color="#f9cf58" fontSize={30} fontWeight={600} textAlign={"center"}>
        Salsabachatero
      </Text>
      <Box display="flex" flexDirection="row" justifyContent={"center"} gap={5}>
        <Icon as={IoArrowUndoSharp} w={8} h={8} color="black" />
        <Text fontSize={24} fontWeight={500} textAlign={"center"}>
          Swipe
        </Text>
        <Icon as={IoArrowRedoSharp} w={8} h={8} color="black" />
      </Box>
      {/* the center of the page */}
      <ImageGallery fav={true}/>
    </Box>
  );
};

export default Index;
