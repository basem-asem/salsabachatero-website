import React, { useEffect, useState } from "react";
import { BsBoxSeam } from "react-icons/bs";
import { MdOutlineAddLocationAlt } from "react-icons/md";
import { PiWechatLogoLight } from "react-icons/pi";
import { GrGallery } from "react-icons/gr";
import { AiOutlinePoweroff, AiOutlineUser } from "react-icons/ai";
import { FcAbout } from "react-icons/fc";
import { FaQuestion } from "react-icons/fa";
import { RiArticleLine } from "react-icons/ri";
import { FiSettings } from "react-icons/fi";
import { Avatar, Box, Button, HStack, Text } from "@chakra-ui/react";
import useTranslation from "@/hooks/useTranslation";
import { manImg } from "./Profile";
import Link from "next/link";
import { useRouter } from "next/router";
import styled from "styled-components";
import { auth } from "@/firebase/firebase";

const StyledFcAbout = styled(FcAbout)`
  font-size: 1.7rem;
  & path {
    fill: black;
  }
`;

const ProfileSidebar = () => {
  const { t } = useTranslation();
  const router = useRouter();
  let linksArr = [
    {
      name: t("user.profile"),
      icon: <AiOutlineUser fontSize={"1.7rem"} />,
      link: "/profile",
    },
    {
      name: t("orders"),
      icon: <BsBoxSeam fontSize={"1.5rem"} />,
      link: "/profile/orders",
    },
    {
      name: t("chat"),
      icon: <PiWechatLogoLight fontSize={"1.7rem"} />,
      link: "/profile/chat",
    },
    {
      name: t("navbar.address"),
      icon: <MdOutlineAddLocationAlt fontSize={"1.7rem"} />,
      link: "/profile/address",
    },
    {
      name: t("navbar.article"),
      icon: <RiArticleLine fontSize={"1.7rem"} />,
      link: "/profile/article",
    },
    {
      name: t("navbar.imagegallery"),
      icon: <GrGallery fontSize={"1.7rem"} />,
      link: "/profile/offers",
    },
    {
      name: t("navabar.FAQs"),
      icon: <FaQuestion fontSize={"1.7rem"} />,
      link: "/profile/faq",
    },
    {
      name: t("navbar.about"),
      icon: <StyledFcAbout />,
      link: "/profile/about",
    },
  ];

  const [userData, setUserData] = useState({});

  useEffect(() => {
    const userDataString = localStorage.getItem("userdata");
    if (userDataString) {
      const parsedUserData = JSON.parse(userDataString);
      setUserData(parsedUserData);
    }
  }, []);

  const handleClick = async () => {
    try {
      await auth.signOut();
      localStorage.clear();
      router.push('/');
    } catch (error) {
      console.error("Error during sign out:", error);
    }
  };

  return (
    <>
      <Box
        display={["none", "none", "none", "block"]}
        borderRadius={"10px"}
        pos={"relative"}
        boxShadow={"rgba(0, 0, 0, 0.16) 0px 1px 4px;"}
      >
        <Box
          bg="red.800"
          borderTopRadius={"10px"}
          pos={"relative"}
          boxShadow={"rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;"}
          w="full"
          h={"150px"}
        >
          <Avatar
            size={"2xl"}
            src={userData["photo_url"] ? userData["photo_url"] : manImg}
            pos={"absolute"}
            top={"50%"}
            right={"30%"}
          />
        </Box>
        <HStack
          flexDir={"column"}
          alignItems={"center"}
          gap={0}
          mt="16"
        >
          <Text fontSize={"20px"} my="1" fontWeight={400}>
            {userData["display_name"]}
          </Text>
          <Text
            fontSize={"20px"}
            mv="4"
            my="1"
            color={"#9F9F9F"}
            fontWeight={400}
          >
            {userData["email"]}
          </Text>
          <Button
            w="75%"
            my="3"
            bg="red.800"
            color={"white"}
            onClick={() => router.push("/profile/settings")}
            _hover={{ bg: "red.600" }}
          >
            <FiSettings
              fontSize={"1.4rem"}
              fontWeight={300}
              style={{ marginInline: "10px" }}
            />
            {t("Settings")}
          </Button>
          {linksArr.map((res, index) => {
            return (
              <Link key={index} href={res.link} style={{ width: "100%" }}>
                <HStack
                  p="3"
                  cursor={"pointer"}
                  px="10"
                  className={
                    router.pathname == res.link ? "active" : "in-avtive"
                  }
                  borderBottom={
                    index === linksArr.length - 1 ? "none" : "1px solid"
                  }
                  borderColor={"blackAlpha.300"}
                  w={"full"}
                >
                  <Box>{res.icon}</Box>
                  <Text
                    width={"100%"}
                    height={"full"}
                    color={router.pathname == res.link ? "white" : "#9F9F9F"}
                    fontWeight={router.pathname == res.link ? 600 : 400}
                    fontSize={"1.1rem"}
                  >
                    {res.name}
                  </Text>
                </HStack>
              </Link>
            );
          })}
          <Button onClick={handleClick} w={"full"}>
            <HStack
              p="3"
              cursor={"pointer"}
              px="6"
              borderColor={"blackAlpha.300"}
              w={"full"}
            >
              <Box>
                <AiOutlinePoweroff fontSize={"1.7rem"} />
              </Box>
              <Text
                width={"100%"}
                height={"full"}
                color={"#9F9F9F"}
                fontWeight={400}
                fontSize={"1.1rem"}
                textAlign={"left"}
              >
                {t("user.logout")}
              </Text>
            </HStack>
          </Button>
        </HStack>
      </Box>
    </>
  );
};

export default ProfileSidebar;
