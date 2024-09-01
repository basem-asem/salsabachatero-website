import CancelOption from "@/components/orders/CancelOption";
import RadioComp from "@/components/orders/RadioComp";
import useTranslation from "@/hooks/useTranslation";
import {
  Button,
  Divider,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { getDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

function OpenCancelOrder({ alertIsOpen, alertIsClose, OpenCancelReasonPops, orderRef }) {
  const { t } = useTranslation();
  const router = useRouter();
  const [orderDetail, setOrderDetail] = useState();

  useEffect(() => {
    const fetchOrderDetail = async () => {
      if (!orderRef) {
        console.error("Order reference is undefined");
        return;
      }

      try {
        const orderDoc = await getDoc(orderRef);
        if (orderDoc.exists()) {
          setOrderDetail(orderDoc.data());
        } else {
          console.error("Order document does not exist");
        }
      } catch (error) {
        console.error("Error fetching order detail:", error);
      }
    };

    fetchOrderDetail();
  }, [orderRef]);

  return (
    <Modal isCentered isOpen={alertIsOpen} onClose={alertIsClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader fontWeight={300} textAlign={"center"} color={"#101010B2"}>
          {t("cancel.order")}
        </ModalHeader>
        <Divider />
        <ModalCloseButton fontSize={"20px"} />
        <ModalBody my={6}>
          <Text textAlign={"center"} fontSize={"20px"} fontWeight={300}>
            {t("cancel.order.test")}{orderDetail?.orderID}
          </Text>
        </ModalBody>
        <ModalFooter bg={"transparent"}>
          <HStack w={"full"} justifyContent={"center"}>
            <Button
              cursor={"pointer"}
              color={"#822727"}
              w={"45%"}
              onClick={() => {
                alertIsClose();
              }}
            >
              {t("no")}
            </Button>
            <Button
              color={"white"}
              bg={"#822727"}
              cursor={"pointer"}
              w={"45%"}
              onClick={() => {
                OpenCancelReasonPops();
                alertIsClose();
              }}
            >
              {t("yes")}
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default OpenCancelOrder;
