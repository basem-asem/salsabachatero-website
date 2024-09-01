import {
  Box,
  CircularProgress,
  Divider,
  Grid,
  HStack,
  Heading,
  Image,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import ProfileSidebar from "../profile/ProfileSidebar";
import useTranslation from "@/hooks/useTranslation";
import { useRouter } from "next/router";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { formatDistanceToNow } from "date-fns";

const Chat = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getChats = async () => {
      let arr = [];
      const userData = localStorage.getItem("userdata")
      const userId = localStorage.getItem("userId");
      const userRef = doc(db, `users/${userId}`);

      const querySnapshot = await getDocs(query(
          collection(db, "chats"),
          where("users", "array-contains", userRef)
        )
      );
      if (querySnapshot.empty) {
        setLoading(false);
      }

      const chatPromises = querySnapshot.docs.map(async (doc) => {
        const userRef = userData?.Role === 'User' ? doc.data().user_b : doc.data().user_a;
        

        let relativeTime = 'Invalid date';
        
        if (doc.data().last_message_time) {
          const firebaseTimestamp = doc.data().last_message_time;
          const parsedDate = firebaseTimestamp.toDate();
      
          if (!isNaN(parsedDate.getTime())) {
            relativeTime = formatDistanceToNow(parsedDate, { addSuffix: true });
          }
        }
        
        
        if (userRef) {
          const userDoc = await getDoc(userRef);
          return {
            ...doc.data(),
            id: doc.id,
            relativeTime:relativeTime,
            user: {
              img: userDoc.data()?.photo_url,
              name: userDoc.data()?.display_name,
            },
          };
        }
      });

      const chatData = await Promise.all(chatPromises);
      setChats(chatData.filter(chat => chat !== undefined));
      setLoading(false);
    };

    const userData = JSON.parse(localStorage.getItem("userdata"));
    if (userData && Object.keys(userData).length) {
      getChats();
    }
  }, []);
console.log(chats)
  return (
    <>
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
          <Box>
            <Heading
              fontSize={"1.5rem"}
              mb={2}
              color={"blackAlpha.800"}
              fontWeight={400}
            >
              {t("chat")}
            </Heading>
            <Divider />
          </Box>
          {loading ? (
            <Grid
              item
              xs={12}
              textAlign="center"
              style={{ justifyContent: "center", display: "flex" }}
            >
              <CircularProgress isIndeterminate />
            </Grid>
          ) : (
            <Grid>
              {chats.map((chat) => (
                <HStack key={chat.id} cursor={"pointer"} onClick={() => router.push(`/profile/chat/${chat.id}`)} boxShadow={"md"} justifyContent={"space-between"} alignItems={"start"}>
                  <HStack p="3" my="3" alignItems={"flex-start"}>
                    <Image borderRadius={"md"} src={chat.user.img} h={"100px"} w="100px" maxH={"100px"} />
                    <Box>
                      <Text fontWeight={500} my={2} mx={2} fontSize={"1.4rem"}>{chat.user.name}</Text>
                      <Text fontWeight={400} my={2} mx={2} fontSize={"1.3rem"} color={"blackAlpha.600"}>
                        {chat.last_message}
                      </Text>
                    </Box>
                  </HStack>
                  <Text fontWeight={300} my={3} mx={3} fontSize={"1.2rem"} color={"blackAlpha.600"}>{chat.relativeTime}</Text>
                </HStack>
              ))}
            </Grid>
          )}
        </Box>
      </Grid>
    </>
  );
};

export default Chat;
