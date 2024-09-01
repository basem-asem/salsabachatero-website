import useTranslation from "@/hooks/useTranslation";
import { Box, Button, HStack, Image, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";

const CartProductList = ({ CartProductDetails }) => {
  const { t } = useTranslation();
  const router = useRouter();
  console.log(CartProductDetails)
  let img =
    "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8d2F0Y2h8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60";
  return (
    <>
      <HStack
        pos={"relative"}
        width={"full"}
        borderRadius={"lg"}
        flexDirection={["column", "column", "row"]}
        my="4"
        boxShadow={"rgba(0, 0, 0, 0.16) 0px 1px 4px"}
      >
        <Image
          objectFit={"fit"}
          borderRadius={["8px 8px 0px 0px", "8px 0px 0px 8px"]}
          width={["full", "230px"]}
          height={"10rem"}
          src={CartProductDetails.image[0]}
        />
        <Box py="4" px="2">
          <Text my="0.5" fontSize={"1.3rem"}>
            {CartProductDetails.name}
          </Text>
          {/* <HStack my={"1"}>
            <Text fontWeight={400} fontSize={["1rem", "1rem", "1.2rem"]}>
              {t("user.userorder.status")}:
            </Text>
            <HStack>
              <Text
                fontWeight={400}
                color={"#FFBB00"}
                fontSize={["1rem", "1rem", "1.2rem"]}
              >
            {CartProductDetails.status}
                
              </Text>
            </HStack>
          </HStack> */}
          <HStack my={"3"}>
            <Text fontWeight={500} fontSize={"1.3rem"}>
              {t("user.quantity")}:
            </Text>
            <HStack>
              <Text fontWeight={400} color={"#10101066"} fontSize={"1.3rem"}>
                {CartProductDetails.quanties}
              </Text>
            </HStack>
          </HStack>
        </Box>
        <Text
          boxShadow={"rgba(0, 0, 0, 0.16) 0px 1px 4px;"}
          p="1"
          px={["1", "1", "3"]}
          color={"#FFBB00"}
          style={
            router.locale == "en"
              ? {
                  position: "absolute",
                  bottom: "0px",
                  right: "0px",
                  fontSize: "1.4rem",
                  zIndex: "1",
                  background: "white",
                  borderRadius: "8px 0px 8px 0px",
                }
              : {
                  position: "absolute",
                  bottom: "0px",
                  left: "0px",
                  zIndex: "1",
                  fontSize: "1.4rem",
                  borderRadius: "0px 8px 0px 8px",
                }
          }
        >
          {CartProductDetails?.amount} {t("product.currancy")}
        </Text>
      </HStack>
    </>
  );
};

export default CartProductList;
