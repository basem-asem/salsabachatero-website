import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Heading,
  Stack,
  Text,
  Image,
  Skeleton,
  CardFooter,
  ButtonGroup,
  Button,
  Box,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { Rating } from "@smastrom/react-rating";
import useTranslation from "@/hooks/useTranslation";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { addOrUpdateProduct } from "@/redux/cartSlice";
import ChakraRating from "./ChakraRatting";
import { Create_Update_Doc, getStaticData } from "@/firebase/firebaseutils";
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { addFavourite, isFavourites, removeFavourite } from "@/util/favutil";

const ProductCard = ({ productDetails }) => {
  const {
    isOpen: orderIsOpen,
    onOpen: orderOnOpen,
    onClose: orderOnClose,
  } = useDisclosure();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [vatPercentage, setVatPercentage] = useState(0.00);
  const cart = useSelector((state) => state.cart);
  const toast = useToast();

  const [isFavourite, setIsFavourite] = useState(false);
  const [addOtherSup, setAddOtherSup] = useState(false);

  useEffect(() => {
    setIsFavourite(isFavourites(productDetails.docid));
  }, [productDetails]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchVatPercentage = async () => {
      try {
        const infosData = await getStaticData("App_Info");
        const vatPer = infosData[0].vat || 0; // Ensure vat is not undefined
        setVatPercentage(vatPer);
      } catch (error) {
        console.error("Error fetching VAT percentage:", error);
      }
    };
    fetchVatPercentage();
  }, []);

  const handleCart = () => {
    const existingSupName = cart.supNames.includes(productDetails.supplierDisplayName);
    
    if (cart.supNames.length !== 0 && !existingSupName) {
      // Open modal if the supplier name is not already in the cart
      orderOnOpen();
    } else {
      // Add product to cart and show banner
      const productToAdd = {
        ...productDetails,
        quanties: 1,
        price: productDetails.on_sale
          ? productDetails.sale_price
          : productDetails.price,
        supplierDisplayName: productDetails.supplierDisplayName,
      };
      
      dispatch(addOrUpdateProduct({ 
        product: productToAdd, 
        vat: vatPercentage,
        supplier: productDetails.supplier,
        supplierDisplayName: productDetails.supplierDisplayName
      }));
      
      showBanner();
    }
  };
  useEffect(() => {
    if (addOtherSup) {
      const productToAdd = {
        ...productDetails,
        quanties: 1,
        price: productDetails.on_sale
          ? productDetails.sale_price
          : productDetails.price,
        supplierDisplayName: productDetails.supplierDisplayName,
      };
  
      dispatch(addOrUpdateProduct({ 
        product: productToAdd, 
        vat: vatPercentage,
        supplier: productDetails.supplier,
        supplierDisplayName: productDetails.supplierDisplayName
      }));
  
      showBanner();
      setAddOtherSup(false); // Reset state
    }
  }, [addOtherSup]);



const handleFavourite = () => {
    if (isFavourite) {
      removeFavourite(productDetails.docid);
      setIsFavourite(false);
    } else {
      addFavourite(productDetails);
      setIsFavourite(true);
    }
  };

  const showBanner = () => {
    toast({
      duration: 1000,
      title: `${t("product.success.title")}`,
      description: `${t("product.success.description")}`,
      status: 'success',
    });
  };


  return (
    <Card my="1" mx="1" color="#101010">
      <CardBody px="0" py="0" width="full">
        <Link href={`/products/${productDetails.docid}`}>
          <Box pos="relative">
            {productDetails.quantity == 0 && (
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
                <Text fontSize={20}>{t("product.outofStock")}</Text>
              </Box>
            )}
            <Skeleton isLoaded={!loading}>
              <Image
                width="full"
                height="200px !important"
                src={productDetails.image[0]}
                alt="Product image"
                borderTopRadius="xl"
              />
            </Skeleton>
            {productDetails.favBtn && (
              <Box
                position="absolute"
                top={0}
                left={0}
                bgRepeat="no-repeat"
                textAlign="center"
                display="flex"
                justifyContent="center"
                alignItems="center"
                backgroundColor="#852830"
                borderRadius="16px 0 16px 0"
              >
                <Text color="white" padding={2}>
                  {t("featured")}
                </Text>
              </Box>
            )}
          </Box>
        </Link>
        <Stack pos="relative" mt="6" spacing="3" px="3">
          <div style={{ display: "flex", alignItems: "center" }}>
            <ChakraRating defaultValue={productDetails.averageRating} />
            <Text
              fontSize="1rem"
              fontWeight={400}
              color="blackAlpha.600"
              pl={2}
            >
              {productDetails.averageRating}
            </Text>
          </div>
          <Heading fontSize="1.2rem">{productDetails.name}</Heading>
          <Text fontSize="1rem" fontWeight={400} color="blackAlpha.600">
            {productDetails.supplierDisplayName}
          </Text>
          <Box
            boxShadow="rgba(0, 0, 0, 0.16) 0px 1px 4px"
            p={2}
            w="fit-content"
            pos="absolute"
            borderRadius={8}
            top="-55px"
            bg="white"
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={2}
          >
            <Text color="#852830" fontSize="24px" fontWeight={400}>
              {t("product.currancy")}{" "}
              {productDetails.on_sale
                ? productDetails.sale_price
                : productDetails.price}
            </Text>
            <Text
              fontSize="18px"
              color="#ccc"
              textDecorationLine="line-through"
            >
              {productDetails.on_sale && productDetails.price}
            </Text>
          </Box>
        </Stack>
      </CardBody>
      <CardFooter px="2.5">
        <ButtonGroup w="full" px="0" justifyContent="space-between" spacing="2">
          <Button
            variant="outline"
            px="3"
            bg="none"
            py="2"
            w="full"
            borderColor="blackAlpha.600"
            color="#101010"
            onClick={handleCart}
            isDisabled={productDetails.quantity == 0}
          >
            {/* <AiOutlineShoppingCart
              style={{
                fontSize: "1.3rem",
                borderColor: "#101010",
                marginInline: "10px",
              }}
            /> */}
            <span
              style={{
                color: "#101010",
                fontWeight: "400",
                fontSize: "1.1rem",
              }}
            >
              {t("add.cart")}
            </span>
          </Button>
          <Button
            bg={isFavourite ? "#822727" : "none"}
            border="1px solid"
            color="#101010"
            borderColor="blackAlpha.600"
            onClick={handleFavourite}
            _focusVisible="none"
            _hover="none"
          >
            {isFavourite ? (
              <AiFillHeart
                style={{
                  fontSize: "1.8rem",
                  borderColor: "#822727",
                  color: "white",
                }}
              />
            ) : (
              <AiOutlineHeart
                style={{ fontSize: "1.8rem", borderColor: "#808080" }}
              />
            )}
          </Button>
        </ButtonGroup>
      </CardFooter>
      <OrderModal t={t} orderIsOpen={orderIsOpen} orderOnClose={orderOnClose} setAddOtherSup={setAddOtherSup}/>
    </Card>
  );
};

export default ProductCard;

function OrderModal({ orderIsOpen, orderOnClose, t ,setAddOtherSup}) {
  const finalRef = React.useRef(null);
  return (
    <>
      <Modal
        size={"xl"}
        isCentered
        finalFocusRef={finalRef}
        isOpen={orderIsOpen}
        onClose={orderOnClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader color={"blackAlpha.700"} textAlign={"center"}>
            {t("product.multiSup.title")}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>{t("product.multiSup")}</Text>
          </ModalBody>

          <ModalFooter gap={5}>
            <Button
              colorScheme="red"
              color={"white"}
              variant="solid"
              onClick={() => {
                setAddOtherSup(true);
                orderOnClose();
              }}
                          >
              {t("ok")}
            </Button>
            <Button
              colorScheme="red"
              color={"white"}
              variant="solid"
              onClick={() => {
                setAddOtherSup(false);
                orderOnClose();
              }}            >
              {t("cancel")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
