import {
  Card,
  CardBody,
  Heading,
  Stack,
  Text,
  Image,
  Divider,
  CardFooter,
  ButtonGroup,
  Button,
  Box,
  Skeleton,
} from "@chakra-ui/react";
import React, { useState } from "react";
import {
  AiFillHeart,
  AiOutlineShoppingCart,
  AiOutlineHeart,
} from "react-icons/ai";
import { Rating } from "@smastrom/react-rating";
import subImg from "@/../../public/assets/sun.png";
import { FaLocationDot } from "react-icons/fa6";

import useTranslation from "@/hooks/useTranslation";
import Link from "next/link";
import ChakraRating from "./ChakraRatting";

const ProviderCard = (props) => {
  const [rating, setRating] = useState(3.5);
  const { t } = useTranslation();
  const { productDetails } = props;

  const [loading, setLoading] = useState(true);
  const [isClicked, setIsClicked] = useState(false);
  const handleClick = () => {
    setIsClicked(!isClicked);
  };
  setTimeout(() => {
    setLoading(false);
  }, 1000);
  return (
    <>
      <Card my="2" mx="1" color={"#101010"} h={"350px"}>
        <CardBody px="0" py={"0"} width={"full"}>
          <Link href={`/suppliers/${productDetails.docid}`}>
            <Box pos={"relative"}>
            {(productDetails.isClosed || productDetails.isActive) && (
              <Box
                bg={"#000000a6"}
                width={"100%"}
                height={"100%"}
                pos={"absolute"}
                top={0}
                left={0}
                color={"white"}
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
              >
               {productDetails.isClosed && <Text fontSize={20}>{t("supplier.isClose")}</Text>}
               {productDetails.isActive && <Text fontSize={20}>{t("supplier.isActive")}</Text>}
              </Box>
            )}
              <Skeleton isLoaded={!loading}>
                <Image
                  width={"full"}
                  height={"200px !important"}
                  src={productDetails.photo_url}
                  alt="Green double couch with wooden legs"
                  borderTopRadius="xl"
                />
              </Skeleton>
            </Box>
          </Link>
          <Stack pos={"relative"} mt="6" spacing="3" px="3">
            <div style={{ display: "flex", alignItems: "center" }}>
            <ChakraRating defaultValue={productDetails.averageRating}/>

              <Text
                fontSize={"1rem"}
                fontWeight={400}
                color={"blackAlpha.600"}
                pl={2}
              >
                {productDetails.averageRating}
              </Text>
            </div>
            <Heading
              fontSize={"1.4rem"}
              style={{
                WebkitLineClamp: "1",
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                display: "-webkit-box",
                textOverflow: "ellipsis",
              }}
            >
              {productDetails.display_name}
            </Heading>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                paddingBottom: "10px",
              }}
            >
              <FaLocationDot style={{width:"3.5rem"}}/>
              <Text
                fontSize={"1.2rem"}
                fontWeight={400}
                color={"blackAlpha.600"}
                style={{
                  WebkitLineClamp: "1",
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  display: "-webkit-box",
                  textOverflow: "ellipsis",
                }}
              >
                {productDetails.address}
              </Text>
            </div>
          </Stack>
        </CardBody>
      </Card>
    </>
  );
};

export default ProviderCard;
