import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Container,
  HStack,
  Icon,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  ListItem,
  Menu,
  MenuButton,
  MenuList,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import { FiBell, FiSearch } from "react-icons/fi";
import { DocumentPopover } from "./DocumentPopover";
import { Logo } from "./Logo";
import { MobileDrawer } from "./MobileDrawer";
import { logo } from "@/components/comman/banner";
import Link from "next/link";
import useTranslation from "@/hooks/useTranslation";
import NotificationCard from "../../comman/NotificationCard";
import { useRouter } from "next/router";
import { FaBell } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import { getFilteredData } from "@/firebase/firebaseutils";
import { collection, doc, getDoc, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { db } from "@/firebase/firebase";

export const Navbar = () => {
  const { t } = useTranslation();
  const linksArr = [
    {
      name: t("home"),
      link: "/home",
    },
    {
      name: t("Favourite"),
      link: "/favourite",
    },
    {
      name: t("Cart"),
      link: "/cart",
    },
  ];
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [userRef, setUserRef] = useState(null);

  useEffect(() => {
    const userDataString = localStorage.getItem("userdata");
    if (userDataString) {
      const parsedUserData = JSON.parse(userDataString);
      const Ref = doc(db, "users", parsedUserData.uid);
      setUserRef(Ref);
      setUserData(parsedUserData);
    }
    
  }, []);
  useEffect(() => {
    if (!userRef) return;

    const UsersQuery = query(
      collection(db, "activity"),
      where("notifyUsers", "array-contains", userRef),orderBy("timePosted","desc")
    );

    const unsubscribe = onSnapshot(UsersQuery, async (querySnapshot) => {
      // Create an array to store all notifications with user data
      const notificationsArray = await Promise.all(querySnapshot.docs.map(async (d) => {
        const userDoc = await getDoc(d.data().owner); // Ensure you get the reference from the document data
        const userInfo = userDoc.exists() ? userDoc.data() : {};
        return {
          docid: d.id,
          picture: userInfo.photo_url,
          ...d.data()
        };
      }));

      // Update the state with the array of notifications
      setNotifications(notificationsArray);
    });

    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, [userRef]);

  return (
    <Box as="section">
      <Box
        // borderBottomWidth="1px"
        bg="bg.accent.default"
        position="relative"
        zIndex="dropdown"
      >
        <Container maxW={"container.xl"} py="4">
          <HStack justify="space-between" w="full" spacing="8">
            <HStack spacing="10" w="full">
              <HStack spacing="3">
                <MobileDrawer />
                <Link href={"/home"}>
                  {" "}
                  <Image width={"130px"} src={logo} />
                </Link>
              </HStack>
              <ButtonGroup
                size="lg"
                spacing="8"
                // bg="white"
                w="full"
                display={{ base: "none", lg: "flex" }}
                justifyContent={"space-between"}
              >
                <UnorderedList
                  display={"flex"}
                  justifyContent={"space-between"}
                  mx="auto"
                  w="35%"
                >
                  {linksArr.map((res, i) => {
                    return (
                      <ListItem
                        key={i}
                        color={
                          router.pathname == res.link
                            ? "#852830"
                            : "blackAlpha.700"
                        }
                        listStyleType={"none"}
                      >
                        <Link
                          href={`${res.link}`}
                          style={{ fontSize: "1.5rem" }}
                        >
                          {res.name}
                        </Link>
                      </ListItem>
                    );
                  })}
                </UnorderedList>
              </ButtonGroup>
            </HStack>
            <HStack spacing={{ base: "2", md: "4" }}>
              <Menu>
                <MenuButton
                  display={["none", "none", "block", "block"]}
                  bg="white"
                  as={Button}
                >
                  <FaBell
                    style={{
                      fontSize: "1.5rem",
                      cursor: "pointer",
                      marginInline: "5px",
                      zIndex: 10000,
                    }}
                  />
                </MenuButton>

                <MenuList
                  display={["none", "none", "block", "block"]}
                  minW={"500px"}
                  mx={"2rem"}
                  maxH={"500px"}
                  overflow={"auto"}
                >
                  <Text
                    mx="4"
                    fontSize={"lg"}
                    fontWeight={"semibold"}
                    color={"#202020"}
                    style={{ marginTop: 0 }}
                    my="2"
                  >
                    {t("Notification")}
                  </Text>
                  {/* Notifications */}
                  {notifications.map((res, i)=>(
                  <NotificationCard key={i} not={res}/>
                  ))}
                </MenuList>
              </Menu>
              {userData && (
                <Avatar
                  onClick={() => router.push("/profile")}
                  cursor="pointer"
                  boxSize="10"
                  style={{objectFit:"fill"}}
                  src={userData.photo_url}
                />
              )}{" "}
            </HStack>
          </HStack>
        </Container>
      </Box>
    </Box>
  );
};
