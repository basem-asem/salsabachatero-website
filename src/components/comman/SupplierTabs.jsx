import useTranslation from "@/hooks/useTranslation";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Heading,
  SimpleGrid,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import ReviewCard from "./ReviewCard";
import ReviewForm from "./ReviewForm";
import { doc } from "firebase/firestore";
import { db } from "@/firebase/firebase";

const SupplierTabs = ({review,supProducts,id}) => {
  const { t } = useTranslation();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const userDataString = localStorage.getItem("userdata");
    if (userDataString) {
      const parsedUserData = JSON.parse(userDataString);
      const Ref = doc(db, "users", parsedUserData.uid)
      setUserData(Ref);
    }
  }, []);

  return (
    <>
      <Tabs
        my="5"
        variant="line"
        px="0"
        colorScheme="red"
        width={"full"}
      >
        <TabList width={"full"}>
          <Tab width={"full"}>{t("navbar.product")}</Tab>
          <Tab width={"full"}>{t("user.review")}</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <SimpleGrid columns={[1, 1, 2, 4]} gap={2}>
            {supProducts && supProducts.map((res, i) => (
            <ProductCard productDetails={res} key={i}/>
            ))}
            </SimpleGrid>
          </TabPanel>
          <TabPanel>
            <Box my="6">
              <Heading fontWeight={500} fontSize={"1.5rem"}>
                {t("Ratings & Reviews")}
              </Heading>
              <Button
                boxShadow={"rgba(0, 0, 0, 0.16) 0px 1px 4px;"}
                w="full"
                my="4"
                onClick={onOpen}
                fontSize={"24px"}
                color={"#822727"}
                fontWeight={400}
                bg="white"
                disabled
              >
                {t("add.review")}
              </Button>
            </Box>
            <ReviewForm name={t('rate.supplier')} onClose={onClose} isOpen={isOpen} id={id} userRef={userData} />
            <Grid
          my="10"
          sx={{
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#822727",
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              backgroundColor: "#822727",
            },
          }}
          overflow={"auto"}
          maxH={"250px"}
          templateColumns={[
            "repeat(1, 1fr)",
            "repeat(2, 1fr)",
            "repeat(2, 1fr)",
            "repeat(2, 1fr)",
          ]}
          gap={6}
        >
          
            {review.map((res, i) => (
              <ReviewCard review={res} key={i}/>
            ))}
        
        </Grid>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};

export default SupplierTabs;
