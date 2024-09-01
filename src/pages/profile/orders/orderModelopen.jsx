import CancelOption from "@/components/orders/CancelOption";
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
import { useRouter } from "next/router";
import { getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

export default function OpenCancelReasonPop({
  orderRef,
  cancelIsOpen,
  cancelIsClose,
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const [orderDetail, setOrderDetail] = useState();
  const [cancel, setCancel] = useState('');

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

  const handleCancel = async () => {
    if (!orderRef || !cancel) {
      console.error("Order reference or cancellation reason is missing");
      return;
    }

    try {
      await updateDoc(orderRef, {
        status: "Canceled",
        cancelationReason: cancel,
      });
      console.log("Order canceled successfully");
      cancelIsClose(); // Close the modal after the update
      router.push("/profile/orders"); // Redirect to orders page or wherever appropriate
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  return (
    <>
      <Modal isCentered isOpen={cancelIsOpen} onClose={cancelIsClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontWeight={300} textAlign={"center"} color={"#101010B2"}>
            {t("cancelation.reason")}
          </ModalHeader>
          <Divider />
          <Divider />
          <Divider />
          <ModalCloseButton fontSize={"20px"} />
          <ModalBody>
            <CancelOption setCancel={setCancel} />
          </ModalBody>
          <ModalFooter>
            <Button
              color={"white"}
              bg={"#822727"}
              cursor={"pointer"}
              w={"full"}
              fontWeight={"400"}
              onClick={handleCancel} // Call handleCancel on click
            >
              {t("cancel.order")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
