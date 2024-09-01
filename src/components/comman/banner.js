import Head from "next/head";
import { Inter } from "next/font/google";
import {
  Box,
  Button,
  Container,
  HStack,
  Heading,
  Image,
  Radio,
  RadioGroup,
  Stack,
  Text,
  theme,
} from "@chakra-ui/react";
import { useState } from "react";
import { useRouter } from "next/router";
import useTranslation from "@/hooks/useTranslation";
import banner from "public/assets/banner.svg";
const inter = Inter({ subsets: ["latin"] });
let bannerImg =
  "https://selal-admin-panel.vercel.app/_next/static/media/Logo.e5340c86.png";
export let logo =
  "https://selal-admin-panel.vercel.app/_next/static/media/Logo.e5340c86.png";

export default function Banner({ title, children }) {
  const router = useRouter();

  const [value, setValue] = useState(
    router.locale == "en" ? "english" : "arabic"
  );
  const [loading, setLoading] = useState(false);

  const { t } = useTranslation();
  const languageHandler = () => {
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem("language", value);
      setLoading(false);
      router.push("/login");
    }, 1500);
  };
  return (
    <>
      <Container
        maxWidth={"full"}
        bgImage={banner.src}
        bgSize={["auto", "auto", "auto", "auto", "contain"]}
        bgRepeat={"no-repeat"}
        className="bgPos"
      >
        <Box
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "50px",
          }}
          justifyContent={["center","center", "space-between"]}
        >
          <Image src={logo} width={"160px"} />
          <Box
            style={{
              alignItems: "center",
              flexDirection: "column",
            }}
            display={["none", "none", "flex"]}
          >
            <Heading
              textAlign={"center"}
              fontSize={"35px"}
              ml={"25px"}
              fontWeight={400}
            >
              {title}
            </Heading>
            <Text
              textAlign={"center"}
              fontSize={"20px"}
              fontWeight={300}
            >
              {t("language.p")}
            </Text>
          </Box>
        </Box>
        {children}
      </Container>
      {/* <Box
        width={"full"}
        height={"350px"}
        borderBottomLeftRadius={"10%"}
        borderBottomRightRadius={"10%"}
        bgColor={"hsla(44, 100%, 50%, 0.2)"}
      >
        <HStack
          width={["90%", "full", "80%", "80%", "80%"]}
          height={"50%"}
          justifyContent={["space-between", "space-between"]}
          mx="auto"
        >
          <Image width={200} src={logo} />
          <Box></Box>
        </HStack>
        <Text mb="71px" textAlign={"center"} fontSize={"30px"} fontWeight={400}>
          {title}
        </Text>

        {children}
      </Box> */}
    </>
  );
}
