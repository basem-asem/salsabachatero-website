import useTranslation from "@/hooks/useTranslation";
import { Box, Divider, HStack, Text,  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  useDisclosure,
  Button, } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Rating } from "@smastrom/react-rating";
import { HiPencil } from "react-icons/hi";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { deleteDocument } from "@/firebase/firebaseutils";
import { useRouter } from "next/router";

const AddressCard = ({setHide, address,editAddress}) => {
  const { t } = useTranslation();
  const [rating, setRating] = useState(3.5);
  const router = useRouter();
  let img =
    "https://firebasestorage.googleapis.com/v0/b/thara-4b3d5.appspot.com/o/Article%2Facadmic.jpg?alt=media&token=3984570b-32a2-445e-b2f8-be31fa566901";
  const [imageLoaded, setImageLoaded] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setImageLoaded(false);
    }, 1000);
  }, []);
  const { isOpen, onOpen, onClose } = useDisclosure()
  const handleDelete = (id)=>{
    deleteDocument("Addresses", id).then(()=>
      onClose()
    )
   }
  return (
    <>
      <Box
        my="5"
        p={["3", "3", "5"]}
        border="1px solid"
        borderRadius={"md"}
        borderColor={"blackAlpha.400"}
      >
        <HStack justifyContent={"space-between"}>
          <Text fontWeight={400} fontSize={["1rem", "1rem", "1.2rem"]}>
           {address.Name}
          </Text>
          <HStack fontWeight={400} fontSize={["1rem", "1rem", "1.2rem"]}>
            <HiPencil onClick={()=>editAddress(address.id)} fontSize={"1.5rem"} cursor="pointer" color="#808080" />
            <MdOutlineDeleteOutline onClick={onOpen} cursor="pointer" color="#808080" fontSize={"1.5rem"} />
          </HStack>
        </HStack>
        <Divider />

        <Box my="2">
          <Text my="1" fontSize={["1rem", "1rem", "1.2rem"]}>
           {address.Address}
          </Text>
          <HStack flexDir={['column','column','row']} alignItems={'flex-start'}>
            <HStack>
              <Text
                my="1"
                fontWeight={400}
                fontSize={["1rem", "1rem", "1.2rem"]}
              >
                {t("teacher.form.name")}
              </Text>
              <Text
                my="1"
                fontWeight={400}
                fontSize={["1rem", "1rem", "1.2rem"]}
                color={"blackAlpha.700"}
              >
                : {address.userName}
              </Text>
            </HStack>
            <HStack>
              <Text
                my="1"
                fontWeight={400}
                fontSize={["1rem", "1rem", "1.2rem"]}
              >
                {t("teacher.form.phone")}
              </Text>
              <Text
                my="1"
                fontWeight={400}
                fontSize={["1rem", "1rem", "1.2rem"]}
                color={"blackAlpha.700"}
              >
                : {address.Phone}
              </Text>
            </HStack>
          </HStack>
        </Box>
        <Divider />
        <AlertDialogExample t={t} isOpen={isOpen} onClose={onClose} handleDelete={handleDelete} id={address.id}/>
      </Box>
    </>
  );
};

export default AddressCard;

function AlertDialogExample({isOpen,onClose,t,handleDelete,id}) {
  const cancelRef = React.useRef()
  return (
    <>
      

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              {t('delete.address')}
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} marginInline={'10px'} onClick={onClose}>
            {t('cancel')}
              </Button>
              <Button colorScheme='red' onClick={()=>handleDelete(id)} ml={3}>
                {t('delete')}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}
