import React, { useEffect, useState } from "react";
import ProfileSidebar from "../profile/ProfileSidebar";
import { Box, CircularProgress, Divider, Grid, Heading, SimpleGrid, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, Button } from "@chakra-ui/react";
import useTranslation from "@/hooks/useTranslation";
import { getStaticData } from "@/firebase/firebaseutils";
import Image from "next/image";

const Offers = () => {
  const { t } = useTranslation();
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    getStaticData("Gallery").then((products) => {
      setFaqs(products);
      setLoading(false);
    });
  }, []);

  const handleImageClick = (image) => {
    setCurrentImage(image);
    onOpen();
  };

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
          p={["3", '3', '5']}
          maxH={'container.md'}
          overflowY={'auto'}
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
          borderRadius={"md"}
          borderColor={"blackAlpha.400"}
        >
          <Box>
            <Heading
              fontSize={"1.5rem"}
              mb={2}
              color={"blackAlpha.800"}
              fontWeight={400}
            >
              {t("ImageGallery")}
            </Heading>
            <Divider />
          </Box>
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
            <SimpleGrid columns={[1, 1, 2, 3]} gap={5} borderRadius={"8px"}>
              {faqs.map((res, i) => {
                return (
                  <Box key={i} onClick={() => handleImageClick(res.image)} cursor="pointer">
                    <Image
                      src={res.image}
                      alt={`Slide ${i}`}
                      layout="responsive"
                      width={500}
                      height={500}
                      quality={10}
                    />
                  </Box>
                );
              })}
            </SimpleGrid>
          )}
        </Box>
      </Grid>
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton border={"2px"} borderRadius={"full"} style={{}}/>
          <ModalBody>
            {currentImage && (
              <Image
                src={currentImage}
                alt="Current Image"
                layout="responsive"
                width={1000}
                height={1000}
                quality={50}
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Offers;
