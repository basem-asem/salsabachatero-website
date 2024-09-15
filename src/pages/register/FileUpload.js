import React, { useEffect, useState } from "react";
import { Box, Input, Avatar, Icon } from "@chakra-ui/react";
import { MdPerson } from "react-icons/md";

const FileUpload = ({ setSelectedFile, selectedFile, square, videos = false }) => {
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
        accept={videos ? "video/*" : "image/*"}  // Set to accept only videos if videos=true, otherwise images
        onChange={handleFileChange}
        display="none"
        id={`file-input-${videos ? 'video' : 'image'}`}  // Unique ID for each input
      />
      <label htmlFor={`file-input-${videos ? 'video' : 'image'}`}>
        <Box
          as="span"
          display="inline-block"
          borderRadius={square === "true" ? "10px" : "full"}
          border="4px solid teal"
          width="120px"
          height="120px"
          overflow="hidden"
          position="relative"
          cursor="pointer"
        >
          {selectedFile ? (
            <Avatar src={URL.createObjectURL(selectedFile)} boxSize="118px" />
          ) : (
            <Icon
              as={MdPerson}
              w={12}
              h={12}
              color="gray.500"
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
            />
          )}
        </Box>
      </label>
    </Box>
  );
};

export default FileUpload;
