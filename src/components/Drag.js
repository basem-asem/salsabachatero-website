import React, { useState } from "react";
import {
  Box,
  Text,
  Stack,
  Progress,
  Center,
  Button,
  Image,
  HStack,
} from "@chakra-ui/react";
import useTranslation from "@/hooks/useTranslation";

const FileUpload = ({ setSelectedFile, selectedFile,register }) => {
  const [isDragging, setIsDragging] = useState(false);
  let img =
    "https://media.istockphoto.com/id/1401980646/photo/3d-rendered-classic-sculpture-metaverse-avatar-with-network-of-low-poly-glowing-purple-lines.webp?b=1&s=170667a&w=0&k=20&c=nLf9fDcHVLZ9bPijP5QQrj0apVLdPXITVF6EAMqj1rg=";
  const { t } = useTranslation();
  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    setSelectedFile(file);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  return (
    <Box
      p={8}
      borderWidth={2}
      borderRadius="md"
      borderColor={isDragging ? "blue.400" : "gray.200"}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      cursor="pointer"
    >
      {selectedFile ? (
        <Stack spacing={4}>
          <HStack>
            <Box width={"80%"}>
              <Text fontWeight="bold">{t("selected")}:</Text>
              <Text>{selectedFile.name}</Text>
              <Progress isAnimated size="xs" value={100} />
            </Box>
            <Box>
              <Image src={img} height={"120px"} width={"150px"} />
            </Box>
          </HStack>
        </Stack>
      ) : (
        <Stack spacing={4}>
          <Center height={100}>
            <Text>{isDragging ? t("drop") : t("file")}</Text>
          </Center>
          <Button as="label" htmlFor="fileInput">
            {t("Choose.image")}
            <input
              type="file"
              id="fileInput"
              name="file"
              {...register('file',{
                required: 'File is required',
                validate: (value) => {
                  if (value.length === 0) return 'Please select a file';
                  if (value[0].size > 5242880) return 'File size exceeds 5MB';
                  return true;
                },
              })}
    
              style={{ display: "none" }}
              // onChange={handleFileInputChange}
            />
          </Button>
        </Stack>
      )}
    </Box>
  );
};

export default FileUpload;
