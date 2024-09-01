import ProfileSidebar from "@/components/profile/ProfileSidebar";
import useTranslation from "@/hooks/useTranslation";
import {
  Avatar,
  Box,
  Container,
  Grid,
  HStack,
  Input,
  Text,
  CircularProgress,
  Button,
} from "@chakra-ui/react";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { AiOutlineSend } from "react-icons/ai";
import { GrAttachment } from "react-icons/gr";
import { IoIosCloseCircle } from "react-icons/io";

import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth, storage } from "@/firebase/firebase"; // Ensure you have auth and storage imported
import Image from "next/image";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getDocumentData } from "@/firebase/firebaseutils";

const createChatMessagesRecordData = ({
  user,
  chat,
  text,
  timestamp,
  image,
}) => ({
  user,
  chat,
  text,
  timestamp,
  image,
});

const createChatsRecordData = ({
  last_Message_Time,
  last_Message_Sent_By,
  last_Message,
}) => ({
  last_Message_Time,
  last_Message_Sent_By,
  last_Message,
});

const Chat = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = router.query;
  const [messages, setMessages] = useState([]);
  const [userData, setUserData] = useState({});
  const [currentuserRef, setCurrentuserRef] = useState();
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(true);
  const [textController, setTextController] = useState("");
  const [uploadedFileUrl, setUploadedFileUrl] = useState("");
  const [file, setFile] = useState(null);
const [users,setUsers]=useState([])
useEffect(() => {
  const fetchMessages = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      console.error("User ID not found in localStorage");
      setLoading(false);
      return;
    }

    const userRef = doc(db, `users/${userId}`);
    setCurrentuserRef(userRef);

    if (id) {
      const chatRef = doc(db, "chats", id);
      const chatData = await getDocumentData("chats", id);
      setUsers(chatData.users);
      
      // Ensure users are set before filtering
      const otherUsers = chatData.users.filter(user => user !== userRef);
      
      // Fetch user documents for other users
      const userDocs = await Promise.all(otherUsers.map(async (user) => {
        const userDoc = await getDoc(user);
        console.log(userDoc.data())
        setUserData({
          id: user.id,
          img: userDoc.data()?.photo_url,
          name: userDoc.data()?.display_name,
        });
      }));
      const messagesQuery = query(
        collection(db, "chat_messages"),
        where("chat", "==", chatRef),
        orderBy("timestamp", "asc")
      );

      const unsubscribe = onSnapshot(messagesQuery, async (querySnapshot) => {
        const fetchedMessages = await Promise.all(querySnapshot.docs.map(async (doc) => {
          const messageData = doc.data();


          return {
            ...messageData,
            id: doc.id,
          };
        }));

        setMessages(fetchedMessages);
        setLoading(false);
      });
      
      // Cleanup function to unsubscribe from the listener when the component unmounts
      return () => {
        unsubscribe();
      };
    }
  };
  
  fetchMessages();
}, [id]);
console.log(userData)

  const uploadImage = async (event) => {
    setImageLoading(false)
    if (!event.target.files[0]) {
      return;
    } else {
      const file = event.target.files[0];
      const fileRef = ref(storage, `chat_images/${file.name}`);
      await uploadBytes(fileRef, file);
      const fileUrl = await getDownloadURL(fileRef);
      setFile(event.target.files[0])
      setUploadedFileUrl(fileUrl);
      setImageLoading(true)
    }
  };

  const sendMessage = async () => {
    if (!textController && !uploadedFileUrl) {
      return;
    }

    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.error("No authenticated user found");
      return;
    }

    const chatRef = doc(db, "chats", id);
    const chatMessagesRecordReference = doc(collection(db, "chat_messages"));

    const chatMessageData = createChatMessagesRecordData({
      user: currentuserRef,
      chat: chatRef,
      text: textController,
      timestamp: serverTimestamp(),
      image: uploadedFileUrl,
    });

    await setDoc(chatMessagesRecordReference, chatMessageData);

    const chatData = createChatsRecordData({
      'last_Message_Time': serverTimestamp(),
      'last_Message_Sent_By': currentuserRef,
      'last_Message': textController,
    });

    await updateDoc(chatRef, {
      ...chatData,
      'last_message_seen_by': [currentuserRef], // assuming lastSeenBy is an array of user IDs
    });

    setTextController("");
    setUploadedFileUrl("");
  };

  return (
    <>
      <Container minH={"container.md"} maxW={"container.xl"}>
        <Grid
          templateColumns={["3fr", "3fr", "3fr", "1fr 3fr"]}
          my="7"
          minH={"container.sm"}
          gap={2}
        >
          <ProfileSidebar />
          <Box
            pos={"relative"}
            p={["3", "3", "5"]}
            sx={{
              "&::-webkit-scrollbar": {
                width: "8px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "blackAlpha.300",
                borderRadius: "4px",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                backgroundColor: "blackAlpha.300",
              },
            }}
            border="1px solid"
            overflowY={"auto"}
            maxH={"container.md"}
            borderRadius={"md"}
            borderColor={"blackAlpha.400"}
          >
            <HStack>
              <Avatar src={userData.img} />
              <Text fontSize={"24px"} fontWeight={600}>
                {userData.name}
              </Text>
            </HStack>
            <HStack
              flexDir={"column"}
              border={"1px solid"}
              p="4"
              borderRadius={"md"}
              my="5"
              minH={"595px"}
              maxH={"595px"}
              overflow={"auto"}
              borderColor={"blackAlpha.500"}
            >
              {loading ? (
                <CircularProgress isIndeterminate />
              ) : (
                messages.map((message) => (
                  <Box
                    key={message.id}
                    maxW={["90%", "90%", "90%", "50%"]}
                    alignSelf={
                      currentuserRef && currentuserRef.id === message.user.id
                        ? "flex-end"
                        : "flex-start"
                    }
                    w="fit-content"
                    p="4"
                    bg={
                      currentuserRef && currentuserRef.id === message.user.id
                        ? "#E9E9E9"
                        : "#FFFFFF"
                    }
                    borderRadius={
                      currentuserRef && currentuserRef.id === message.user.id
                        ? "20px 00px 20px 20px"
                        : "00px 20px 20px 20px"
                    }
                    boxShadow={"0 0 5px 0px #ccc"}
                    color={
                      currentuserRef && currentuserRef.id === message.user.id
                        ? "#000"
                        : "#000"
                    }
                    borderBottom={
                      currentuserRef && currentuserRef.id === message.user.id
                        ? "3px solid #822727"
                        : "none"
                    }
                    my="3"
                  >
                    <Text>{message.text}</Text>
                    {message.image && (
                      <Image
                        src={message.image}
                        width={200}
                        height={200}
                        style={{ paddingTop: "5px" }}
                      />
                    )}
                    <Text
                      fontSize={".7rem"}
                      color={"blackAlpha.600"}
                      textAlign={"right"}
                      pt={"5px"}
                    >
                      {message.timestamp &&
                        new Date(
                          message.timestamp.seconds * 1000
                        ).toLocaleTimeString()}
                    </Text>
                  </Box>
                ))
              )}
            </HStack>
            {uploadedFileUrl && (
              <HStack  pos={"relative"} width={200} py={5}>
                <IoIosCloseCircle size={20} style={{position:"absolute", top:"0", right:"-10px", cursor:"pointer"}} onClick={() => setUploadedFileUrl("")}/>
                      <Image
                      src={uploadedFileUrl}
                      width={200}
                      height={200}
                      />
                      </HStack>
                    )}
            <Box display={"flex"} alignItems={"center"} gap={2}>
              <Input
                type="file"
                accept="image/*"
                onChange={uploadImage}
                style={{ display: "none" }}
                id="file-upload"
              />
              {imageLoading? <Button
                as="label"
                htmlFor="file-upload"
                variant="outline"
                size="md"
                bgColor={"#F6C1A7"}
                cursor={"pointer"}
              >
                <GrAttachment />
              </Button>:<CircularProgress isIndeterminate size={30}/>}
              <Box pos={"relative"} flex={1}>
                <Input
                  width={"full"}
                  _focusVisible={{ borderColor: "#822727" }}
                  placeholder={t("type")}
                  value={textController}
                  onChange={(e) => setTextController(e.target.value)}
                />
                <AiOutlineSend
                  style={{
                    fontSize: "1.2rem",
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    cursor: "pointer",
                  }}
                  onClick={sendMessage}
                />
              </Box>
            </Box>
          </Box>
        </Grid>
      </Container>
    </>
  );
};

export default Chat;
