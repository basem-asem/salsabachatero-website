import React, { useState } from "react";
import { Box, Input, Avatar, Icon, Text } from "@chakra-ui/react";
import { MdPerson, MdCheckCircle } from "react-icons/md"; // Added MdCheckCircle icon for video upload
import Image from "next/image";

export let manImg =
  "https://media.istockphoto.com/id/1354776457/vector/default-image-icon-vector-missing-picture-page-for-website-design-or-mobile-app-no-photo.jpg?s=612x612&w=0&k=20&c=w3OW0wX3LyiFRuDHo9A32Q0IUMtD4yjXEvQlqyYk9O4=";

const FileUpload = ({
  setSelectedFile,
  selectedFile,
  square,
  videos = false,
}) => {
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  return (
    <Box textAlign="center" display={"flex"} flexDirection={"column"}>
      <Input
        type="file"
        accept={videos ? "video/*" : "image/*"} // Accept only videos if videos=true, otherwise images
        onChange={handleFileChange}
        display="none"
        id={`file-input-${videos ? "video" : "image"}`} // Unique ID for each input
      />
      <label htmlFor={`file-input-${videos ? "video" : "image"}`}>
        <Box
          as="span"
          borderRadius={square === "true" ? "10px" : "full"}
          border="4px solid teal"
          width="120px"
          height="120px"
          overflow="hidden"
          position="relative"
          cursor="pointer"
          alignItems={"center"}
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"center"}
        >
          {selectedFile ? (
            videos ? (
              <Box textAlign="center">
                <Icon as={MdCheckCircle} boxSize={8} color="green.500" />
                <Text fontSize="sm" color="green.500">
                  Video Uploaded
                </Text>
              </Box>
            ) : square ? (
              <Image
                alt="uploadedImage"
                src={URL.createObjectURL(selectedFile)}
                height={120}
                width={120}
                style={{ objectFit: "cover", height: "120px" }}
              />
            ) : (
              <Avatar
                src={URL.createObjectURL(selectedFile)}
                alt="uploadedImage"
                boxSize="118px"
              />
            )
          ) : (
            <Image
              alt="defualtImage"
              src={manImg}
              height={120}
              width={120}
              style={{ objectFit: "cover", height: "120px" }}
            />
          )}
        </Box>
      </label>
    </Box>
  );
};

export default FileUpload;
