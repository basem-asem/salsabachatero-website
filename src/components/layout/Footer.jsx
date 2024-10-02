import {
  Box,
  Container,
  Image,
  ListItem,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import React from "react";
import { logo } from "../comman/banner";
import Link from "next/link";
import useTranslation from "@/hooks/useTranslation";

const Footer = () => {
  const {t} = useTranslation()
  let arr = [
    {
      link: "/",
      name: t("home"),
    },
    {
      link: "/profile/about",
      name: t("about.aboutus"),
    },
    // {
    //   link: "/profile/mission",
    //   name: t("mission"),
    // },
    {
      link: "/profile/contact",
      name: t("navbar.contact"),
    }
  ];

  let linksArr = [
    {
      link: "/profile/privacy",
      name: t("about.privacypolicy"),
    },
    {
      link: "/profile/terms",
      name: t("terms"),
    },
   
  ];
  return (
    <>
      <Container py="0" maxW={"container.xl"}>
        <Image width={"200px"} m={10} mx="auto" src={logo} />
        <UnorderedList
          my="10"
          w="full"
          mx="auto"
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          {arr.map((res,i) => {
            return (
              <ListItem key={i} fontSize={"1.1rem"} mx="3" listStyleType={"none"}>
                <Link href={res.link}>{res.name}</Link>
              </ListItem>
            );
          })}
        </UnorderedList>
      </Container>
      <Box bg="#E4E4E4" py="5" height={"auto"} width={"full"}>
        <Box display={"flex"} justifyContent={"center"} gap={1}>
        <Text color='blackAlpha.700' textAlign={"center"}>
          {t('company')}
        </Text>
        <Text color='blackAlpha.700' textAlign={"center"}>
          {t('myTecnology')}
        </Text>
        </Box>
          
        <UnorderedList
          my="10"
          w="full"
          mx="auto"
          display={"flex"}
          flexWrap={"nowrap"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          {linksArr.map((res,i) => {
            return (
              <ListItem key={i} color='blackAlpha.700' fontSize={"1.1rem"} mx="5" listStyleType={"none"}>
                <Link href={res.link}>{res.name}</Link>
              </ListItem>
            );
          })}
        </UnorderedList>
      </Box>
    </>
  );
};

export default Footer;
