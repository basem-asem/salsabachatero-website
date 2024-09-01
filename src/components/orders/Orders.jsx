import React, { useEffect, useState } from "react";
import ProfileSidebar from "../profile/ProfileSidebar";
import {
  Box,
  Divider,
  Grid,
  HStack,
  Heading,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  CircularProgress,
  SimpleGrid,
} from "@chakra-ui/react";
import useTranslation from "@/hooks/useTranslation";
import RadioComp from "./RadioComp";
import OrderCard from "./OrderCard";
import { collection, doc, getDoc, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { db } from "@/firebase/firebase";

const Orders = () => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [info, setInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [status, setStatus] = useState(t("all")); // Default to "all"

  useEffect(() => {
    const userDataString = localStorage.getItem("userdata");
    if (userDataString) {
      const parsedUserData = JSON.parse(userDataString);
      const Ref = doc(db, "users", parsedUserData.uid);
      setUserData(Ref);
    }
  }, []);

  useEffect(() => {
    if (!userData) return;

    const fetchData = async () => {
      const userOrderRef = collection(db, "Orders");
      const data = query(
        userOrderRef,
        where("customer", "==", userData),
        orderBy("created_at", "desc")
      );

      onSnapshot(data, async (querySnapshot) => {
        const orders = [];
        for (const orderDoc of querySnapshot.docs) {
          const orderData = orderDoc.data();
          if (orderData.cartItems && orderData.cartItems.length > 0) {
            const itemDoc = await getDoc(orderData.cartItems[0]);
            const itemData = itemDoc.data();
            const productDoc = await getDoc(itemData.product);
            if (productDoc.exists()) {
              const productData = productDoc.data();
              orders.push({ ...orderData, id: orderDoc.id, productData });
            }
          }
        }
        setInfo(orders);
        setLoading(false);
      });
    };
    fetchData();
  }, [userData]);

  // Filter orders based on status
  const filteredOrders = info.filter((order) => status === t("all") || order.status === status);

  return (
    <>
      <Grid
        templateColumns={["3fr", "3fr", "3fr", "1fr 3fr"]}
        my="7"
        minH={"container.sm"}
        gap={2}
      >
        <ProfileSidebar />
        <Box
          pos={"relative"}
          p={["3", "3", "3"]}
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

              <Text
                color={"blackAlpha.800"}
                cursor={"pointer"}
                onClick={onOpen}
                borderBottom={"1px solid"}
                fontWeight={400}
                fontSize={"1.4rem"}
              >
                {t("user.userorder.status")}
              </Text>
            </HStack>
            <Divider />
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
                {filteredOrders.map((res, i) => (
                  <OrderCard orderDetails={res} key={i} />
                ))}
              </SimpleGrid>
            )}
          </Box>
        </Box>
        <BasicUsage onClose={onClose} t={t} isOpen={isOpen} setStatus={setStatus} />
      </Grid>
    </>
  );
};

function BasicUsage({ isOpen, onClose, t, setStatus }) {
  return (
    <>
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontWeight={400}
            textAlign={"center"}
            color={"blackAlpha.700"}
          >
            {t("user.userorder.orderstatus")}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <RadioComp setStatus={setStatus} />
          </ModalBody>

          <ModalFooter>
            <Button
              variant="solid"
              bg="red.800"
              onClick={onClose}
              color={"white"}
            >
              {t("ok")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default Orders;
