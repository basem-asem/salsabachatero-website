import React, { useEffect, useState } from "react";
import ProfileSidebar from "../../../components/profile/ProfileSidebar";
import {
  Box,
  Divider,
  Grid,
  HStack,
  Heading,
  Text,
  useDisclosure,
  Button,
  Image,
  Container,
  CircularProgress,
  SimpleGrid,
} from "@chakra-ui/react";
import useTranslation from "@/hooks/useTranslation";
import RadioComp from "../../../components/orders/RadioComp";
import OrderCard from "../../../components/orders/OrderCard";
import { useRouter } from "next/router";
import Cart from "@/components/CartDetails/Cart";
import CartProductList from "@/components/orders/CartProductList";
import OrderSummery from "@/components/orders/OrderSummery";
import OpenCancelOrder from "./orderModel";
import OpenCancelReasonPop from "./orderModelopen";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";

const OrderDetails = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const {
    isOpen: alertIsOpen,
    onOpen: OpenCancelOrderPop,
    onClose: alertIsClose,
  } = useDisclosure();
  const {
    isOpen: cancelIsOpen,
    onOpen: OpenCancelReasonPops,
    onClose: cancelIsClose,
  } = useDisclosure();

  let img =
    "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8d2F0Y2h8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60";
  const { id } = router.query;
  const [orderDetail, setOrderDetail] = useState();
  const [userData, setUserData] = useState();
  const [supplierData, setSupplierData] = useState();
  const [deliveryCompData, setDeliveryCompData] = useState();
  const [orderRef, setOrderRef] = useState();
  const [appData, setAppData] = useState();
  const [deliveryAddressData, setDeliveryAddressData] = useState();
  const [productDetailData, setProductDetailData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      if (!id) return;

      const OrderRef = doc(db, "Orders", id);
      const appInfo = doc(db, "App_Info", "REb0tInWwCwlcW5D2hmD");
      setOrderRef(OrderRef);

      try {
        const orderDoc = await getDoc(OrderRef);

        const appInfoData = await getDoc(appInfo);
        setAppData(appInfoData.data());
        setOrderDetail(orderDoc.data());

        const getUserData = await getDoc(orderDoc.data().customer);
        if (getUserData.exists()) {
          setUserData(getUserData.data());
        } else {
          console.log("User Doc Not Found");
        }

        if (orderDoc.data().Suppliers) {
          const getSupplierData = await getDoc(orderDoc.data().Suppliers);
          if (getSupplierData.exists()) {
            setSupplierData(getSupplierData.data());
          } else {
            console.log("Supplier Doc Not Found");
          }
        } else {
          console.log("Supplier Doc Not Found");
        }

        const newCartItems = [];
        for (let i = 0; i < orderDoc.data().cartItems.length; i++) {
          const product = await getDoc(orderDoc.data().cartItems[i]);
          const productData = product.data();
          const z = await getDoc(productData.product);
          const c = z.data();
          newCartItems.push({
            ...c,
            id: doc.id,
            quanties: productData.quantity,
            amount: productData.totalItamPrice,
          });
        }
        setCartItems(newCartItems);

        if (orderDoc.data().pickedAdress) {
          const address = orderDoc.data().pickedAdress;
          const getDeliverAddressData = await getDoc(address);
          if (getDeliverAddressData.exists()) {
            setDeliveryAddressData(getDeliverAddressData.data());
          } else {
            console.log("Address Doc Not Found");
          }
        } else {
          console.log("Address Doc Not Found");
        }

        if (orderDoc.data().rider) {
          const getDeliveryCompData = await getDoc(orderDoc.data().rider);
          if (getDeliveryCompData.exists()) {
            setDeliveryCompData(getDeliveryCompData.data());
          } else {
            console.log("DeliveryCompany Doc Not Found");
          }
        } else {
          console.log("DeliveryCompany Doc Not Found");
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching order detail:", error);
        setIsLoading(false);
      }
    };

    fetchOrderDetail();
  }, [id]);
  return (
    <>
      <Container minH={"container.md"} maxW={"container.xl"}>
        <Grid
          templateColumns={["3fr", "3fr", "3fr", "1fr 3fr"]}
          my="7"
          minH={"container.sm"}
          gap={2}
        >
          <ProfileSidebar />
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
              <HStack w="full" mb="2" justifyContent={"space-between"}>
                <Heading
                  fontSize={"1.5rem"}
                  mb={2}
                  color={"blackAlpha.800"}
                  fontWeight={400}
                >
                  {t("order.detail")}
                </Heading>

                {/* <Text
                  color={"blackAlpha.800"}
                  cursor={"pointer"}
                  onClick={onOpen}
                  borderBottom={"1px solid"}
                  fontWeight={400}
                  fontSize={"1.4rem"}
                >
                  {t("user.userorder.status")}
                </Text> */}
              </HStack>
              <Divider />
            </Box>
            {isLoading ? (
              <Grid
                item
                xs={12}
                textAlign="center"
                style={{ justifyContent: "center", display: "flex" }}
              >
                <CircularProgress isIndeterminate />
              </Grid>
            ) : (
              <Box my="5" p={["3", "2"]}>
                <HStack justifyContent={"space-between"}>
                  <Text
                    fontWeight={500}
                    color={"#101010"}
                    fontSize={["1rem", "1rem", "1.4rem"]}
                  >
                    Order#{orderDetail.orderID}
                  </Text>
                  <HStack
                    fontWeight={400}
                    fontSize={["1rem", "1rem", "1.2rem"]}
                  >
                    <Text color={"#822727"} fontWeight={"600"}>
                      {orderDetail.finalPrice.toFixed(2)}{" "}
                      {t("product.currancy")}
                    </Text>
                  </HStack>
                </HStack>
                <HStack>
                  <Box>
                    <HStack my={"1"}>
                      <Text
                        fontWeight={500}
                        fontSize={["1rem", "1rem", "1.2rem"]}
                      >
                        {t("order.time")}:
                      </Text>
                      <Text
                        fontWeight={300}
                        fontSize={["1rem", "1rem", "1.2rem"]}
                      >
                        {orderDetail.created_at && router?.locale == "ar"
                          ? new Date(orderDetail.created_at.seconds * 1000)
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
                          : new Date(orderDetail.created_at.seconds * 1000)
                              .toUTCString()
                              .replace("GMT", "")}
                      </Text>
                    </HStack>
                    <HStack my={"1"}>
                      <Text
                        fontWeight={500}
                        fontSize={["1rem", "1rem", "1.2rem"]}
                      >
                        {t("dashboard.TotalProduct")}:
                      </Text>
                      <Text
                        fontWeight={300}
                        fontSize={["1rem", "1rem", "1.2rem"]}
                      >
                        {orderDetail.itemsQuantity}
                      </Text>
                    </HStack>
                    <HStack>
                      <Text
                        fontWeight={500}
                        fontSize={["1rem", "1rem", "1.2rem"]}
                      >
                        {t("user.userorder.status")}:
                      </Text>
                      <Text
                        fontWeight={500}
                        color={"#822727"}
                        fontSize={["1rem", "1rem", "1.2rem"]}
                      >
                        {orderDetail.status}
                      </Text>
                    </HStack>
                  </Box>
                </HStack>
                <Divider my={"5"} />
                <HStack justifyContent={"space-between"}>
                  <Text
                    fontWeight={500}
                    color={"#101010"}
                    fontSize={["1rem", "1rem", "1.4rem"]}
                  >
                    {t("ship")}
                  </Text>
                </HStack>
                <Text
                  fontWeight={500}
                  my={2}
                  color={"#822727"}
                  fontSize={["1rem", "1rem", "1.4rem"]}
                >
                  {deliveryAddressData?.Address}
                </Text>
                <HStack my={"2"} display={["flex"]} flexDirection={["column",'row']}>
                  <Text fontWeight={300} fontSize={["1rem", "1rem", "1.4rem"]}>
                    {t("user.name")}:
                  </Text>
                  <HStack>
                    <Text
                      fontWeight={300}
                      color={"#10101066"}
                      fontSize={["1rem", "1rem", "1.4rem"]}
                    >
                      {deliveryAddressData?.Name}
                    </Text>
                  </HStack>
                  <HStack mx={"3"}>
                    <Text
                      fontWeight={300}
                      fontSize={["1rem", "1rem", "1.4rem"]}
                    >
                      {t("phone.number")}:
                    </Text>
                    <HStack>
                      <Text
                        fontWeight={300}
                        color={"#10101066"}
                        fontSize={["1rem", "1rem", "1.4rem"]}
                      >
                        {deliveryAddressData?.Phone}
                      </Text>
                    </HStack>
                  </HStack>
                </HStack>
                <Divider my={"5"} />
                <HStack justifyContent={"space-between"}>
                  <Text
                    fontWeight={500}
                    color={"#101010"}
                    fontSize={["1rem", "1rem", "1.4rem"]}
                  >
                    {t("supplierdetail.title")}
                  </Text>
                </HStack>
                <Text
                  fontWeight={500}
                  my={2}
                  color={"#822727"}
                  fontSize={["1rem", "1rem", "1.4rem"]}
                >
                  {supplierData.address}
                </Text>
                <HStack my={"2"} display={["flex"]} flexDirection={["column",'row']}>
                  <Text fontWeight={300} fontSize={["1rem", "1rem", "1.4rem"]}>
                    {t("user.name")}:
                  </Text>
                  <HStack>
                    <Text
                      fontWeight={300}
                      color={"#10101066"}
                      fontSize={["1rem", "1rem", "1.4rem"]}
                    >
                      {supplierData.display_name}
                    </Text>
                  </HStack>
                  <HStack mx={"3"}>
                    <Text
                      fontWeight={300}
                      fontSize={["1rem", "1rem", "1.4rem"]}
                    >
                      {t("phone.number")}:
                    </Text>
                    <HStack>
                      <Text
                        fontWeight={300}
                        color={"#10101066"}
                        fontSize={["1rem", "1rem", "1.4rem"]}
                      >
                        {supplierData.phone_number}
                      </Text>
                    </HStack>
                  </HStack>
                </HStack>
                <Divider my={"5"} />
                <HStack justifyContent={"space-between"}>
                  <Text
                    fontWeight={500}
                    color={"#101010"}
                    fontSize={["1rem", "1rem", "1.4rem"]}
                  >
                    {t("order.payment.method")}
                  </Text>
                </HStack>
                <Text fontWeight={300} fontSize={["1rem", "1rem", "1.4rem"]}>
                  {orderDetail.paymentMethod}
                </Text>
                <Divider my={"5"} />
                <HStack justifyContent={"space-between"}>
                  <Text
                    fontWeight={500}
                    color={"#101010"}
                    fontSize={["1rem", "1rem", "1.4rem"]}
                  >
                    {t("order.note")}
                  </Text>
                </HStack>
                <Text
                  width={"95%"}
                  fontWeight={300}
                  my={"1"}
                  fontSize={["1rem", "1rem", "1.4rem"]}
                >
                  {orderDetail.orderNote
                    ? orderDetail.orderNote
                    : t("user.detail.notfound")}
                </Text>
                <Divider my={"5"} />
                <Text
                  fontWeight={500}
                  color={"#101010"}
                  fontSize={["1rem", "1rem", "1.4rem"]}
                >
                  {t("product.list")}
                </Text>
                {isLoading ? (
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
                  {cartItems.map((res, i) => (
                    <CartProductList CartProductDetails={res} key={i} />
                  ))}
                </SimpleGrid>
                )}

                <OrderSummery orderDetail={orderDetail} />
                {orderDetail.status == "Pending" && (
                  <Button
                    w={"full"}
                    fontSize={"20px"}
                    bg={"#822727"}
                    color={"white"}
                    fontWeight={300}
                    onClick={OpenCancelOrderPop}
                  >
                    {t("cancel.order")}
                  </Button>
                )}
              </Box>
            )}
          </Box>
        </Grid>
      </Container>
      {/* <BasicUsage onClose={onClose} t={t} isOpen={isOpen} /> */}
      <OpenCancelOrder
        orderRef={orderRef}
        alertIsOpen={alertIsOpen}
        alertIsClose={alertIsClose}
        t={t}
        OpenCancelReasonPops={OpenCancelReasonPops}
      />
      <OpenCancelReasonPop
        orderRef={orderRef}
        cancelIsOpen={cancelIsOpen}
        cancelIsClose={cancelIsClose}
        t={t}
      />
    </>
  );
};

export default OrderDetails;
