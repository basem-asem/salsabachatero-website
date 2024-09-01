import useTranslation from "@/hooks/useTranslation";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Grid,
  HStack,
  Heading,
  Input,
  Text,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { HiOutlinePencil } from "react-icons/hi";
import ProfileSidebar from "./ProfileSidebar";
import { useRouter } from "next/router";
import Component from "../comman/AutoComplete";
import { auth, db, storage } from "@/firebase/firebase"; // import storage from firebase config
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // import necessary functions for file upload

export let manImg =
  "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFufGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60";

const Profile = () => {
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
        description: "There was an issue updating your profile. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Grid templateColumns={["3fr",'3fr','3fr',"1fr 3fr"]} my="7" minH={"container.sm"} gap={2}>
        <ProfileSidebar />
        <Box
          pos={"relative"}
          p={["3",'3','5']}
          border="1px solid"
          borderRadius={"md"}
          borderColor={"blackAlpha.400"}
        >
          <Box>
            <Heading
              fontSize={"1.5rem"}
              mb={2}
              color={"blackAlpha.800"}
              fontWeight={400}
            >
              {t("user.profile")}
            </Heading>
            <Divider />
          </Box>
          <HStack
            alignItems={"center"}
            justifyContent={"center"}
            flexDir={"column"}
            mt="10"
          >
            <HStack
              pos={"relative"}
              justifyContent={"flex-start"}
              w="40%"
              flexDir={"column"}
            >
              <Avatar size={"2xl"} src={userData["photo_url"] ? userData["photo_url"] : manImg} />
              {hide && (
                <Box
                  pos={"absolute"}
                  bottom={"37%"}
                  bg="red.800"
                  p="2"
                  _hover={{ bg: "red.600" }}
                  cursor={"pointer"}
                  borderRadius={"40%"}
                  right={['10%','10%',"33%"]}
                >
                 <label htmlFor="file-choose">
                   <HiOutlinePencil
                     fontSize={"1.3rem"}
                     style={{ color: "white", cursor: "pointer" }}
                   />
                 </label>
                 <Input type="file" hidden id="file-choose" onChange={handleFileChange} />
                </Box>
              )}
              <Text fontSize={"20px"} my="0" fontWeight={400}>
                {userData["display_name"]}
              </Text>
              <Text
                fontSize={"20px"}
                mv="4"
                color={"blackAlpha.700"}
                fontWeight={400}
              >
                {userData["email"]}
              </Text>
            </HStack>
            {!hide ? (
              <Box pos={"relative"} w={['full','full','90%']}>
                <HStack py="2" my="2" fontSize={"1.1rem"}>
                  <Text color={"blackAlpha.800"}>
                    {t("teacher.form.name")} :
                  </Text>
                  <Text color={"blackAlpha.700"}> {userData["display_name"]} </Text>
                </HStack>
                <Divider />
                <HStack my="2" py="2" fontSize={"1.1rem"}>
                  <Text color={"blackAlpha.800"}>{t("login.email")} : </Text>
                  <Text color={"blackAlpha.700"}> {userData["email"]} </Text>
                </HStack>
                <Divider />
                <HStack my="2" py="2" fontSize={"1.1rem"}>
                  <Text color={"blackAlpha.800"}>{t("user.phone")} : </Text>
                  <Text color={"blackAlpha.700"}> {userData["phone_number"]} </Text>
                </HStack>
                <Divider />
              </Box>
            ) : (
              <Box pos={"relative"} w={['full','full','90%']}>
                <Input
                  mt="2"
                  w="full"
                  _focusVisible={{ borderColor: "#FFBB00" }}
                  placeholder={t("teacher.form.name")}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <Input
                  my="2"
                  w="full"
                  type="email"
                  _focusVisible={{ borderColor: "#FFBB00" }}
                  placeholder={t("login.email")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <PhoneInput
                  country={"in"}
                  containerClass="phoneContainer"
                  buttonStyle={
                    router.locale === "ar"
                      ? { paddingRight: "22px" }
                      : { paddingLeft: "8px" }
                  }
                  inputClass="phoneInput"
                  inputStyle={{ paddingBlock: "22px" }}
                  inputProps={{
                    name: "phone",
                    required: true,
                    autoFocus: false,
                  }}
                  value={phone}
                  onChange={(phone) => setPhone(phone)}
                />
                <Box my='2'>
                  {/* <Component /> */}
                </Box>
              </Box>
            )}
          </HStack>
          <Button
            w={['full','full',"50%"]}
            right={"25%"}
            pos={['static','static',"absolute"]}
            bottom={"20px"}
            onClick={hide ? updateProfile : () => setHide(true)}
            color={"white"}
            _hover={{ bg: "red.600" }}
            bg="red.800"
          >
            {hide ? t("form.btn.update") : t("edit")}
          </Button>
        </Box>
      </Grid>
    </>
  );
};

export default Profile;
