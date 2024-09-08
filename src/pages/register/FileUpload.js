import React, { useState } from "react";
import { Box, Button, Input, Avatar, Text, Icon } from "@chakra-ui/react";
import { MdPerson } from "react-icons/md";
const FileUpload = ({ setSelectedFile, selectedFile ,square}) => {
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  return (
    <Box textAlign="center" display={"flex"} flexDirection={"column"} padding={5}>
      <Input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        display="none"
        id="file-input"
      />
      <label htmlFor="file-input">
        <Box
          as="span"
          display="inline-block"
          borderRadius={square=="true"?"10px": "full"}
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
