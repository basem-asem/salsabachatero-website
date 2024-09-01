import ProfileSidebar from "@/components/profile/ProfileSidebar";
import { getStaticData } from "@/firebase/firebaseutils";
import useTranslation from "@/hooks/useTranslation";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Heading,
} from "@chakra-ui/react";
import Head from "next/head";
import React, { useEffect, useState } from "react";

const Index = () => {
  const { t } = useTranslation();
  const [faqs, setFaqs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getStaticData("FAQ").then((faq) => {
      setFaqs(faq);
      setIsLoading(false);
    });
  }, []);

  return (
    <>
      <Head>
        <title>Faq</title>
      </Head>
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
              <Heading
                fontSize={"1.5rem"}
                mb={2}
                color={"blackAlpha.800"}
                fontWeight={400}
              >
                {t("navabar.FAQs")}
              </Heading>
              <Divider />
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
                <Accordion defaultIndex={[0]} allowMultiple mx={5}>
                  {faqs.map((faq, i) => (
                    <AccordionItem
                      key={i}
                      my={5}
                      boxShadow="lg" // Add box shadow here
                      borderRadius="md" // Optional: Add border radius for better appearance
                    >
                      <h2>
                        <AccordionButton>
                          <Box as="span" flex="1" textAlign="left">
                            {faq.title}
                          </Box>
                          <AccordionIcon />
                        </AccordionButton>
                      </h2>
                      <AccordionPanel pb={4}>
                        {faq.description}
                      </AccordionPanel>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </Box>
          </Box>
        </Grid>
      </Container>
    </>
  );
};

export default Index;
