import { db } from "@/firebase/firebase";
import { getStaticData } from "@/firebase/firebaseutils";
import useTranslation from "@/hooks/useTranslation";
import {
  Box,
  Button,
  Divider,
  HStack,
  Heading,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCoupon } from "@/redux/cartSlice";

const OrderDetail = () => {
  const { t } = useTranslation();
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [info, setInfo] = useState(0.0);
  const [vat, setVat] = useState(0.0);
  const [allTotal, setAllTotal] = useState(0.0);
  const [couponInput, setCouponInput] = useState("");
  const [loading, setLoading] = useState(true); // Added loading state
  const checkCoupon = async () => {
    const q = query(collection(db, "Coupon"), where("code", "==", couponInput));
    const querySnapshot = await getDocs(q);
  
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const expiryDate = new Date(data.expiryDate);
      if (expiryDate > new Date()) {
        const discount = Math.floor(data.discount);
        dispatch(addCoupon({ discount }));
      }
    });
  };
  

  useEffect(() => {
    const fetchProductsAndSuppliers = async () => {
      try {
        const infosData = await getStaticData("App_Info");
        const delFee = infosData[0].delFee || 0; // Ensure delFee is not undefined
        const vatPer = infosData[0].vat || 0; // Ensure VAT is not undefined

        const calculatedFee =
          cart.suppliers.length > 0 ? delFee * cart.suppliers.length : 0;
        const calculatedVat = cart.total > 0 ? (vatPer * cart.total) / 100 : 0;
        setAllTotal( cart.discount == 0 ? cart.total + calculatedFee + calculatedVat:  cart.total + calculatedFee + calculatedVat - cart.discount);

        setInfo(calculatedFee);
        setVat(calculatedVat);
      } catch (error) {
        console.error("Error fetching products or suppliers:", error);
      } finally {
        setLoading(false); // Ensure loading is set to false after fetching data
      }
    };
    fetchProductsAndSuppliers();
  }, [cart.suppliers.length, cart.total, cart.discount]);

  return (
    <>
      <Box my="5" py="2" boxShadow={"rgba(0, 0, 0, 0.16) 0px 1px 4px;"}>
        <Heading
          marginInline={"2"}
          fontWeight={500}
          fontSize={"28px"}
          color={"blackAlpha.700"}
          mx={3}
        >
          {t("user.userorder.orderdetail.title")}
        </Heading>
        <Divider h={"10px"} />
        <Divider />
        <Divider />
        <Divider />
        <Box px="2" mx={2}>
          <HStack my="2" justifyContent={"space-between"}>
            <Text fontSize={"1.1rem"} color={"blackAlpha.700"}>
              {t("total")}
            </Text>
            <Text fontSize={"1.2rem"} color={"black"}>
              {cart.total.toFixed(2)} {t("product.currancy")}
            </Text>
          </HStack>
          <HStack my="2" justifyContent={"space-between"}>
            <Text fontSize={"1.1rem"} color={"blackAlpha.700"}>
              {t("product.discount")}
            </Text>
            <Text fontSize={"1.2rem"} color={"black"}>
              {cart.discount.toFixed(2)} {t("product.currancy")}
            </Text>
          </HStack>
          <HStack my="2" justifyContent={"space-between"}>
            <Text fontSize={"1.1rem"} color={"blackAlpha.700"}>
              {t("product.deliveryfee")}
            </Text>
            <Text fontSize={"1.2rem"} color={"black"}>
              {info.toFixed(2)} {t("product.currancy")}
            </Text>
          </HStack>
          <HStack my="2" justifyContent={"space-between"}>
            <Text fontSize={"1.1rem"} color={"blackAlpha.700"}>
              {t("about.vat")}
            </Text>
            <Text fontSize={"1.2rem"} color={"black"}>
              {vat.toFixed(2)} {t("product.currancy")}
            </Text>
          </HStack>
          <Text fontSize={"1.1rem"} color={"blackAlpha.700"}>
            {t("coupon.form.couponCode")}
          </Text>
          {cart.discount<=0?(<HStack my="2" justifyContent={"space-between"}>
              <Input
                w="85%"
                onChange={(e) => setCouponInput(e.target.value)}
                _focusVisible={{ borderColor: "#FFBB00" }}
                placeholder={t("coupon.form.couponCode")}
              />
              <Button onClick={checkCoupon}>
                <Text fontSize={"1.1rem"} color={"blackAlpha.700"}>
                  {t("coupon.form.head")}
                </Text>
              </Button>
            </HStack>):( <Text py={5} fontSize={"1rem"} fontWeight={500} color={"#822727"}>
                  {t("coupon.code.applied")}
                </Text>)
            
          }
        </Box>
        <Divider />
        <Divider />
        <Divider />
        <HStack my={"2"} mx={"3"} justifyContent={"space-between"}>
          <Text fontWeight={400} fontSize={["1rem", "1rem", "1.4rem"]}>
            {t("total.payment")}:
          </Text>
          <HStack>
            <Text fontSize={"1.2rem"} color={"#822727"}>
              {allTotal.toFixed(2)} {t("product.currancy")}
            </Text>
          </HStack>
        </HStack>
      </Box>
    </>
  );
};

export default OrderDetail;
