import { getStaticData } from "@/firebase/firebaseutils";
import useTranslation from "@/hooks/useTranslation";
import { Box, Button, Divider, HStack, Image, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { BiSolidCheckCircle } from "react-icons/bi";

const OrderSummery = ({ orderDetail }) => {
  const { t } = useTranslation();
  const router = useRouter();

  const [info, setInfo] = useState(0.0);
  const [vat, setVat] = useState(0.0);
  const [dis, setDis] = useState(0);
  console.log(orderDetail);
  useEffect(() => {
    const fetchProductsAndSuppliers = async () => {
      try {
        const infosData = await getStaticData("App_Info");
        const delFee = infosData[0].delFee || 0; // Ensure delFee is not undefined
        const vatPer = infosData[0].vat || 0; // Ensure VAT is not undefined

        const calculatedVat = (vatPer * orderDetail.total) / 100;
        const calculatedDis =
          (orderDetail.total * orderDetail.discountPer) / 100;
        setInfo(delFee);
        setDis(calculatedDis);
        setVat(calculatedVat);
      } catch (error) {
        console.error("Error fetching products or suppliers:", error);
      }
    };
    fetchProductsAndSuppliers();
  }, []);

  let img =
    "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8d2F0Y2h8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60";
  return (
    <>
      <HStack
        pos={"relative"}
        width={"full"}
        borderRadius={"xl"}
        my="4"
        p="4"
        boxShadow={"rgba(0, 0, 0, 0.16) 0px 1px 4px"}
      >
        <Box w="full">
          <HStack w="full" mb="2">
            <Text fontSize={"1.5rem"} color={"blackAlpha.800"} fontWeight={400}>
              {t("user.userorder.orderdetail.title")}
            </Text>
          </HStack>
          <Divider />
          <Divider />
          <Divider />
          <HStack my={"2"} justifyContent={"space-between"}>
            <Text
              fontWeight={400}
              color={"#10101066"}
              fontSize={["1rem", "1rem", "1.4rem"]}
            >
              {t("total")}:
            </Text>
            <HStack>
              <Text fontWeight={500} fontSize={["1rem", "1rem", "1.4rem"]}>
                {orderDetail.total} {t("product.currancy")}
              </Text>
            </HStack>
          </HStack>
          {orderDetail.discountPer != 0 && (
            <HStack my={"2"} justifyContent={"space-between"}>
              <Text
                fontWeight={400}
                color={"#10101066"}
                fontSize={["1rem", "1rem", "1.4rem"]}
              >
                {t("product.discount")}:
              </Text>
              <HStack>
                <Text fontWeight={500} fontSize={["1rem", "1rem", "1.4rem"]}>
                  {dis} {t("product.currancy")}
                </Text>
              </HStack>
            </HStack>
          )}
          <HStack my={"2"} justifyContent={"space-between"}>
            <Text
              fontWeight={400}
              color={"#10101066"}
              fontSize={["1rem", "1rem", "1.4rem"]}
            >
              {t("product.deliveryfee")}:
            </Text>
            <HStack>
              <Text fontWeight={500} fontSize={["1rem", "1rem", "1.4rem"]}>
                {info} {t("product.currancy")}
              </Text>
            </HStack>
          </HStack>
          <HStack my={"2"} justifyContent={"space-between"}>
            <Text
              fontWeight={400}
              color={"#10101066"}
              fontSize={["1rem", "1rem", "1.4rem"]}
            >
              {t("about.vat")}:
            </Text>
            <HStack>
              <Text fontWeight={500} fontSize={["1rem", "1rem", "1.4rem"]}>
                {vat} {t("product.currancy")}
              </Text>
            </HStack>
          </HStack>
          {orderDetail.discountPer != 0 && (
            <Text fontWeight={400} fontSize={["1rem", "1rem", "1.4rem"]}>
              {t("coupon.code.applied")}
            </Text>
          )}
          {orderDetail.discountPer != 0 && (
            <HStack my={"2"} justifyContent={"space-between"}>
              <Text
                fontWeight={400}
                color={"#10101066"}
                fontSize={["1rem", "1rem", "1.4rem"]}
              >
                {orderDetail.discountPer}% {t("order.discount")}
              </Text>
              <HStack>
                <BiSolidCheckCircle
                  style={
                    router.locale == "en"
                      ? {
                          fontSize: "1.7rem",
                          color: "#822727",
                        }
                      : {
                          fontSize: "1.7rem",
                          color: "#822727",
                        }
                  }
                />
              </HStack>
            </HStack>
          )}
          <Divider />
          <Divider />
          <Divider />
          <HStack my={"2"} justifyContent={"space-between"}>
            <Text fontWeight={400} fontSize={["1rem", "1rem", "1.4rem"]}>
              {t("total.payment")}:
            </Text>
            <HStack>
              <Text
                fontWeight={500}
                color={"#822727"}
                fontSize={["1rem", "1rem", "1.4rem"]}
              >
                {orderDetail.finalPrice.toFixed(2)} {t("product.currancy")}
              </Text>
            </HStack>
          </HStack>
        </Box>
      </HStack>
    </>
  );
};

export default OrderSummery;
