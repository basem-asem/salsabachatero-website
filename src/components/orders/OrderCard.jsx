import useTranslation from "@/hooks/useTranslation";
import { Box, Divider, HStack, Text, Image, Skeleton } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Rating } from "@smastrom/react-rating";
import { Router, useRouter } from "next/router";

const OrderCard = ({ orderDetails }) => {
  const { t } = useTranslation();
  const router = useRouter();
    const [imageLoaded, setImageLoaded] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setImageLoaded(false);
    }, 1000);
  }, []);
  // console.log(orderDetails);
  return (
    <>
      <Box
        my="2"
        p={["3", "3", "3"]}
        border="1px solid"
        borderRadius={"md"}
        borderColor={"blackAlpha.400"}
        cursor={"pointer"}
        onClick={() => router.push(`/profile/orders/${orderDetails.orderID}`)}
      >
        <HStack justifyContent={"space-between"}>
          <Text fontWeight={400} fontSize={["1rem", "1rem", "1.2rem"]}>
            Order#{orderDetails.orderID}
          </Text>
          <HStack fontWeight={400} fontSize={["1rem", "1rem", "1.2rem"]}>
            <Text color={"blackAlpha.700"}>{t("user.userorder.status")}</Text>
            <Text>: {orderDetails.status}</Text>
          </HStack>
        </HStack>
        <Divider />
        <HStack my="2">
          <Skeleton
            borderRadius={"md"}
            isLoaded={!imageLoaded}
            height={"90px"}
            width="150px"
          >
            <Image
              objectFit="cover"
              loading="lazy"
              width={"150px"}
              height={"90px"}
              borderRadius={"md"}
              src={orderDetails.productData.image[0]}
            />
          </Skeleton>
          <Box>
            {/* <Rating
              readOnly
              style={{ maxWidth: 250, fontSize: "1.1rem", width: "100px" }}
              value={rating}
              onChange={setRating}
            /> */}
            <Text my="1" fontSize={["1rem", "1rem", "1.2rem"]}>
            {orderDetails.productData.name}
            </Text>
            <Text
              my="1"
              fontWeight={400}
              fontSize={["1rem", "1rem", "1.2rem"]}
              color={"blackAlpha.700"}
            >
              {t("order.time")} :{" "}
              {orderDetails.created_at && router?.locale == "ar"
                ? new Date(orderDetails.created_at.seconds * 1000)
                    .toUTCString()
                    .replace("GMT", "")
                    .replace("Sat", "السبت")
                    .replace("Sun", "الاحد")
                    .replace("Mon", "الاثنين")
                    .replace("Tue", "الثلاثاء")
                    .replace("Wed", "الاربعاء")
                    .replace("Thu", "الخميس")
                    .replace("Fri", "الجمعة")
                    .replace("Jan", "يناير")
                    .replace("Feb", "فبراير")
                    .replace("Mar", "مارس")
                    .replace("Apr", "ابريل")
                    .replace("May", "مايو")
                    .replace("Jun", "يونيو")
                    .replace("Jul", "يوليو")
                    .replace("Aug", "اغسطس")
                    .replace("Sept", "سبتمبر")
                    .replace("Nov", "نوفمبر")
                    .replace("Oct", "اكتوبر")
                    .replace("Dec", "ديسمبر")
                : new Date(orderDetails.created_at.seconds * 1000)
                    .toUTCString()
                    .replace("GMT", "")}
            </Text>
            <Text
              my="1"
              fontWeight={400}
              fontSize={["1rem", "1rem", "1.2rem"]}
              color={"blackAlpha.700"}
            >
              {t("dashboard.TotalProduct")} : {orderDetails.itemsQuantity}
            </Text>
          </Box>
        </HStack>
        <Divider />
        <HStack justifyContent={"space-between"}>
          <Text
            my="1"
            fontWeight={400}
            fontSize={["1rem", "1rem", "1.2rem"]}
            color={"blackAlpha.700"}
          >
            {t("total.payment")}
          </Text>
          <Text
            color={"blackAlpha.700"}
            fontSize={["1rem", "1rem", "1.2rem"]}
            fontWeight={400}
          >
            {orderDetails.finalPrice.toFixed(2)} {t("product.currancy")}
          </Text>
        </HStack>
      </Box>
    </>
  );
};

export default OrderCard;
