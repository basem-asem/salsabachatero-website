import ProfileSidebar from "@/components/profile/ProfileSidebar";
import useTranslation from "@/hooks/useTranslation";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Grid,
  HStack,
  Heading,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import { AiOutlineMail } from "react-icons/ai";
import { FaFacebookSquare } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FiPhoneCall } from "react-icons/fi";
import Image from "next/image";
import Insta from "@/../../public/assets/insta.svg";
import twitter from "@/../../public/assets/download.png";
import { getStaticData } from "@/firebase/firebaseutils";
import Link from "next/link";

const index = () => {
  const { t } = useTranslation();
  const [info, setInfo] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductsAndSuppliers = async () => {
      try {
        const infosData = await getStaticData("App_Info");
        setInfo(infosData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products or suppliers:", error);
        setLoading(false);
      }
    };
    fetchProductsAndSuppliers();
  }, []);
  return (
    <>
      <Head>
        <title>About Us</title>
      </Head>
      <Container minH={"container.md"} maxW={"container.xl"}>
        <Grid
          templateColumns={["3fr", "3fr", "3fr", "1fr 3fr"]}
          my="7"
          minH={"container.sm"}
          gap={2}
        >
          <ProfileSidebar />
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
            <SimpleGrid>
              {info.map((res, i) => (
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
                      {t("about.aboutus")}
                    </Heading>
                    <Divider />

                    <Text my={"5"} color={"blackAlpha.700"}>
                      {res.aboutUs}
                    </Text>
                  </Box>
                  <HStack flexDir={["column", "column", "row"]} gap={"10rem"}>
                    <HStack>
                      <FiPhoneCall color={"#822727"} fontSize={"2rem"} />
                      <Box color={"blackAlpha.700"}>
                        <Text color={"#822727"}>{res.email}</Text>
                      </Box>
                    </HStack>
                    <HStack>
                      <AiOutlineMail color={"#822727"} fontSize={"2rem"} />
                      <Box color={"blackAlpha.700"}>
                        <Text color={"#822727"}>{res.phone}</Text>
                      </Box>
                    </HStack>
                  </HStack>
                  <HStack
                    mx={"auto"}
                    justifyContent={"center"}
                    my="5"
                    maxW={"container.sm"}
                  >
                    <Link href={res.tweeter}>
                    <Image
                      src={twitter}
                      width={40}
                      height={40}
                      style={{
                        fontSize: "1.5rem",
                        color: "white",
                      }}
                      />
                      </Link>
                      <Link href={res.facebook}>
                    <FaFacebookSquare
                      style={{
                        fontSize: "2.6rem",
                        cursor: "pointer",
                        color: "#3D5A98",
                      }}
                      />
                      </Link>
                      <Link href={res.Instragram}>
                    <Image
                      src={Insta}
                      width={40}
                      height={40}
                      style={{
                        fontSize: "1.5rem",
                        color: "white",
                      }}
                      />
                      </Link>
                  </HStack>
                </Box>
              ))}
            </SimpleGrid>
          )}
        </Grid>
      </Container>
    </>
  );
};

export default index;
