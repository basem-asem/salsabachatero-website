import useTranslation from "@/hooks/useTranslation";
import "react-phone-input-2/lib/style.css";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { auth, db, storage } from "@/firebase/firebase"; // import storage from firebase config
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // import necessary functions for file upload
import {
  Box,
  Heading,
  Avatar,
  Button,
  Link,
  VStack,
  Text,
  HStack,
  Icon,
  useToast,
  Grid,
  Divider,
} from "@chakra-ui/react";
import {
  FiArrowLeft,
  FiUser,
  FiCalendar,
  FiPhone,
  FiMail,
  FiShield,
  FiLogOut,
} from "react-icons/fi";
import Head from "next/head";

export let manImg =
  "https://media.istockphoto.com/id/1354776457/vector/default-image-icon-vector-missing-picture-page-for-website-design-or-mobile-app-no-photo.jpg?s=612x612&w=0&k=20&c=w3OW0wX3LyiFRuDHo9A32Q0IUMtD4yjXEvQlqyYk9O4=";

const index = () => {
  const { t } = useTranslation();
  const [hide, setHide] = useState(false);
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userData, setUserData] = useState({});
  const [selectedFile, setSelectedFile] = useState(null); // new state variable for file
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    const userDataString = localStorage.getItem("userdata");
    if (userDataString) {
      const parsedUserData = JSON.parse(userDataString);
      setUserData(parsedUserData);
      setName(parsedUserData.display_name);
      setEmail(parsedUserData.email);
      setPhone(parsedUserData.phone_number);
    }
  }, []);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const updateProfile = async () => {
    try {
      const userIdString = localStorage.getItem("userId");
      const userRef = doc(db, "users", userIdString);

      let photoURL = userData.photo_url;
      if (selectedFile) {
        const storageRef = ref(storage, `users/${userIdString}/uploads`);
        await uploadBytes(storageRef, selectedFile);
        photoURL = await getDownloadURL(storageRef);
      }

      await updateDoc(userRef, {
        display_name: name,
        email: email,
        phone_number: phone,
        photo_url: photoURL,
      });

      const updatedUserData = {
        ...userData,
        display_name: name,
        email: email,
        phone_number: phone,
        photo_url: photoURL,
      };

      localStorage.setItem("userdata", JSON.stringify(updatedUserData));
      setUserData(updatedUserData);
      toast({
        title: "Profile updated.",
        description: "Your profile has been updated successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setHide(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error updating profile.",
        description:
          "There was an issue updating your profile. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };
  const handleClick = async () => {
    try {
      await auth.signOut();
      localStorage.clear();
      router.push("/");
    } catch (error) {
      console.error("Error during sign out:", error);
    }
  };
  return (
    <Grid
      display={"flex"}
      justifyContent={"center"}
      height={"100vh"}
      alignItems={"center"}
      backgroundImage="url('/assets/backgroundImage.png')"
    >
      <Head>
        <title>Create Event</title>
      </Head>
      <Box
        width={["100%","70%", "50%"]}
        padding={["20px", "40px"]}
        margin={["10px","auto"]}
        my={10}
        backgroundColor="#F6F6F6"
        border="1px solid #E0E0E0"
        borderRadius="12px"
        boxShadow="0 2px 8px rgba(0, 0, 0, 0.1)"
      >
        {/* Header */}
        <HStack mb="6" alignItems="center" justifyContent={"space-between"}>
          <Button variant="ghost" p="0">
            <Icon
              as={FiArrowLeft}
              boxSize={6}
              onClick={() => router.push("/home")}
            />
          </Button>
          <Box display="flex" alignItems="center" flexDirection="column">
            <Avatar
              src={userData["photo_url"] ? userData["photo_url"] : manImg}
              size="lg"
              ml="4"
            />
            <Heading size="lg" ml="4">
              {name}
            </Heading>
          </Box>
        </HStack>

        {/* Account Section */}
        <VStack spacing="4" align="stretch" mb="6">
          <Heading size="sm">Your Account</Heading>
          <Link
            href="/edit-profile"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            border="1px solid #E0E0E0"
            borderRadius="12px"
            boxShadow="0 2px 8px rgba(0, 0, 0, 0.1)"
            p={"15px"}
          >
            <HStack>
              <Icon as={FiUser} />
              <Text>Edit Profile</Text>
            </HStack>
            <Icon as={FiArrowLeft} transform="rotate(180deg)" />
          </Link>
          <Link
            href="/edit-events"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            border="1px solid #E0E0E0"
            borderRadius="12px"
            boxShadow="0 2px 8px rgba(0, 0, 0, 0.1)"
            p={"15px"}
          >
            <HStack>
              <Icon as={FiCalendar} />
              <Text>Edit Events</Text>
            </HStack>
            <Icon as={FiArrowLeft} transform="rotate(180deg)" />
          </Link>
          <Link
            href="/edit-events"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            border="1px solid #E0E0E0"
            borderRadius="12px"
            boxShadow="0 2px 8px rgba(0, 0, 0, 0.1)"
            p={"15px"}
          >
            <HStack>
              <Icon as={FiCalendar} />
              <Text>Edit Courses</Text>
            </HStack>
            <Icon as={FiArrowLeft} transform="rotate(180deg)" />
          </Link>
        </VStack>

        {/* App Settings Section */}
        <VStack spacing="4" align="stretch" mb="6">
          <Heading size="sm">App Settings</Heading>
          <Link
            href="/email-us"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            border="1px solid #E0E0E0"
            borderRadius="12px"
            boxShadow="0 2px 8px rgba(0, 0, 0, 0.1)"
            p={"15px"}
          >
            <HStack>
              <Icon as={FiMail} />
              <Text>Email Us</Text>
            </HStack>
            <Icon as={FiArrowLeft} transform="rotate(180deg)" />
          </Link>
          <Link
            href="/privacy-policy"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            border="1px solid #E0E0E0"
            borderRadius="12px"
            boxShadow="0 2px 8px rgba(0, 0, 0, 0.1)"
            p={"15px"}
          >
            <HStack>
              <Icon as={FiShield} />
              <Text>Privacy & Policy</Text>
            </HStack>
            <Icon as={FiArrowLeft} transform="rotate(180deg)" />
          </Link>
        </VStack>

        {/* Logout Button */}
        <Button
          variant="outline"
          bgColor={"gray.300"}
          w="full"
          leftIcon={<FiLogOut />}
          onClick={handleClick}
        >
          Log Out
        </Button>
      </Box>
    </Grid>
  );
};

export default index;
