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
  Input,
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
import { Create_Update_Doc, getDocumentData } from "@/firebase/firebaseutils";

export let manImg =
"https://firebasestorage.googleapis.com/v0/b/bachataalist-x7jsy8.appspot.com/o/users%2FemptyUser.jpg?alt=media&token=5b06dd23-78e6-4bd5-aca9-c47daf2ff880"
const index = () => {
  const { t } = useTranslation();
  const [hide, setHide] = useState(0);
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [privacy, setPrivacy] = useState("");
  const [userData, setUserData] = useState({});
  const [selectedFile, setSelectedFile] = useState(null); // new state variable for file
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    const userDataString = localStorage.getItem("userdata");
    const parsedUserData = JSON.parse(userDataString);
    setUserData(parsedUserData);
    if (userDataString&& hide == 1) {
      setName(parsedUserData.display_name);
      setEmail(parsedUserData.email);
      setPhone(parsedUserData.phone_number);
    }else{
      setEmail("");
      setPhone("");
      setName("");
    }
  }, [hide]);
  useEffect(() => {
    if (hide == 5){
      getDocumentData("appInfo", "e2x5U3lTXMtp7kV5N9tP").then((data) => setPrivacy(data.privacy));
      console.log(privacy);
    }
  }, [hide]);
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
      setEmail("");
      setPhone("");
      setName("");
      setHide(0);
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
  const handleReturn = () => {
    if (hide!=0){
      setHide(0);
    }else{
      router.push("/home")
    }
  };
  const sendEmail = () => {
    const date = new Date();
    const data = {comment: phone, email: email, name: name, date: date};
    Create_Update_Doc("contactUs",data).then(() => {
      toast({
        title: "Message sent.",
        description: "Your message has been sent successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setEmail("");
      setPhone("");
      setName("");
      setHide(0);
    });
  };
  return (
    <Grid
    height={hide == 1||hide == 4  ? "100vh" : "auto"}
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      backgroundSize={"cover"}
      backgroundImage="url('/assets/backgroundImage.png')"
    >
      <Head>
        <title>Profile</title>
      </Head>
      <Box
        width={["100%","70%", "50%"]}
        padding={["20px", "40px"]}
        margin={"10px"}
        my={10}
        backgroundColor="#F6F6F6"
        border="1px solid #E0E0E0"
        borderRadius="12px"
        boxShadow="0 2px 8px rgba(0, 0, 0, 0.1)"
      >
        {/* Header */}
        <HStack mb="6" alignItems="center" justifyContent={hide ==0||hide ==1?"space-between":""}>
          <Button variant="ghost" p="0">
            <Icon
              as={FiArrowLeft}
              boxSize={6}
              onClick={handleReturn}
            />
          </Button>
          {hide ==0||hide ==1?(

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
            ):(
              <Text margin={"auto"} fontWeight={700} style={{fontSize:"20px"}}>
                {hide == 5? "Privacy & Policy": "Contact Us"}
              </Text>
            )}
        </HStack>
{hide==1?(
   <VStack spacing="4" align="stretch">
   <Input
     placeholder="Name"
     value={name}
     onChange={(e) => setName(e.target.value)}
   />
   <Input
     placeholder="Email"
     value={email}
     onChange={(e) => setEmail(e.target.value)}
   />
   <Input
     placeholder="Phone"
     value={phone}
     onChange={(e) => setPhone(e.target.value)}
   />
   <Input type="file" onChange={handleFileChange} />
   <Button onClick={updateProfile}>Save Profile</Button>
 </VStack>
):hide == 0 ? (
  <Box>

        <VStack spacing="4" align="stretch" mb="6">
          <Heading size="sm">Your Account</Heading>
          <Link
            onClick={()=> setHide(1)}
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
            href="/myEvents"
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
            href="/myCourses"
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
            onClick={()=> setHide(4)}
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
            onClick={()=> setHide(5)}
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
):hide==5?(<Text>{privacy}</Text>):(
<VStack spacing="4" align="stretch">
   <Input
     placeholder="Name"
     value={name}
     onChange={(e) => setName(e.target.value)}
   />
   <Input
     placeholder="Email"
     value={email}
     onChange={(e) => setEmail(e.target.value)}
   />
   <Input
     placeholder="Comment"
     value={phone}
     onChange={(e) => setPhone(e.target.value)}
   />
   <Button onClick={sendEmail}>Submit</Button>
 </VStack>
)}

      </Box>
    </Grid>
  );
};

export default index;
