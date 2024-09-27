import React, { useState } from "react";
import { Box, Input, Avatar, Icon, Text, Progress } from "@chakra-ui/react";
import { MdPerson, MdCheckCircle } from "react-icons/md"; // Added MdCheckCircle icon for video upload
import Image from "next/image";

export let manImg =
  "https://media.istockphoto.com/id/1354776457/vector/default-image-icon-vector-missing-picture-page-for-website-design-or-mobile-app-no-photo.jpg?s=612x612&w=0&k=20&c=w3OW0wX3LyiFRuDHo9A32Q0IUMtD4yjXEvQlqyYk9O4=";

const FileUpload = ({
  setSelectedFile,
  selectedFile,
  square,
  editImage,
  setEditImage,
  videos = false,
}) => {
  const [uploading, setUploading] = useState(false); // State to manage upload status
  const [progress, setProgress] = useState(0); // State to manage upload progress

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setUploading(true); // Start uploading process
      simulateUpload(file); // Simulate the upload process (replace with actual upload function)
    }
    if (editImage) {
      setEditImage(false);
    }
  };

  // Simulated file upload function to demonstrate the progress bar
  const simulateUpload = (file) => {
    const uploadDuration = 5000; // Simulate upload taking 5 seconds
    let interval = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + 20; // Increment by 20% for each interval
        if (newProgress >= 100) {
          clearInterval(interval);
          setUploading(false); // Upload complete
        }
        return newProgress;
      });
    }, uploadDuration / 5); // Update progress every 1 second (5 intervals)
  };

  return (
    <Box textAlign="center" display={"flex"} flexDirection={"column"} alignItems="center">
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
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {selectedFile ? (
            uploading ? (
              <Box textAlign="center">
                <Progress value={progress} size="xs" colorScheme="green" width="100px" />
                <Text fontSize="sm" color="gray.500">
                  Uploading...
                </Text>
              </Box>
            ) : videos ? (
              <Box textAlign="center">
                <Icon as={MdCheckCircle} boxSize={8} color="green.500" />
                <Text fontSize="sm" color="green.500">
                  Video Uploaded
                </Text>
              </Box>
            ) : square ? (
              <Image
                alt="uploadedImage"
                src={editImage ? selectedFile : URL.createObjectURL(selectedFile)}
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
              alt="defaultImage"
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
