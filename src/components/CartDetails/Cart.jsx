import { Box, Button, HStack, Image, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
import useTranslation from "@/hooks/useTranslation";
import { useDispatch } from "react-redux";
import { deleteProduct, updateProductQuantity } from "@/redux/cartSlice";

const Cart = ({ product }) => {
  const { t } = useTranslation();
  const [totalPrice, setTotalPrice] = useState(0);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const price = product.on_sale ? product.sale_price : product.price;
    setTotalPrice(product.quanties * price);
  }, [product]);

  const addQuantity = () => {
    if (product.quantity > 0) {
      const newQuantity = product.quanties + 1;
      dispatch(updateProductQuantity({ id: product.docid, quantity: newQuantity }));
    }
  };

  const subQuantity = () => {
    if (product.quanties > 1) {
      const newQuantity = product.quanties - 1;
      dispatch(updateProductQuantity({ id: product.docid, quantity: newQuantity }));
    }
  };

  const removeProduct = () => {
    dispatch(deleteProduct({ id: product.docid, price: product.price, quantity: product.quanties }));
  };

  return (
    <HStack
      pos={"relative"}
      width={"full"}
      borderRadius={"lg"}
      my="2"
      boxShadow={"rgba(0, 0, 0, 0.16) 0px 1px 4px"}
    >
      <Image
        objectFit={"cover"}
        borderRadius={"8px 0px 0px 8px"}
        width={"130px"}
        height={"150px"}
        src={product.image[0]}
        alt={product.name}
      />
      <Box py="4" px="2">
        <Text color={"#adb5bd"}>{product.supplierDisplayName}</Text>
        <Text my="0.5" fontSize={"1.3rem"}>
          {product.name}
        </Text>
        <HStack paddingTop="4" className="buttonsBox">
          <Button fontSize={"1.2rem"} bg={"#822727"} color={"white"} onClick={subQuantity} className="decreaseBtn">
            -
          </Button>
          <Text>{product.quanties}</Text>
          <Button bg={"#822727"} fontSize={"1.2rem"} color={"white"} onClick={addQuantity} className="increaseBtn">
            +
          </Button>
        </HStack>
      </Box>
      <Text
        boxShadow={"rgba(0, 0, 0, 0.16) 0px 1px 4px"}
        p="1"
        px={["1", "1", "3"]}
        color={"#822727"}
        style={
          router.locale === "en"
            ? {
                position: "absolute",
                bottom: "0px",
                right: "0px",
                fontSize: "1.1rem",
                zIndex: "20",
                background: "white",
                borderRadius: "8px 0px 8px 0px",
              }
            : {
                position: "absolute",
                bottom: "0px",
                left: "0px",
                zIndex: "20",
                fontSize: "1.1rem",
                borderRadius: "0px 8px 0px 8px",
              }
        }
      >
        {totalPrice.toFixed(2)} {t("product.currancy")}
      </Text>
      <IoCloseCircleOutline
        onClick={removeProduct}
        style={
          router.locale === "en"
            ? {
                position: "absolute",
                top: "12px",
                fontWeight: "300",
                right: "13px",
                fontSize: "2rem",
                cursor: "pointer",
              }
            : {
                position: "absolute",
                top: "12px",
                left: "13px",
                fontSize: "1.5rem",
                cursor: "pointer",
              }
        }
      />
    </HStack>
  );
};

export default Cart;
