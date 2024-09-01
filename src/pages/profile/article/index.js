import ArticleCard from "@/components/comman/ArticleCard";
import ProfileSidebar from "@/components/profile/ProfileSidebar";
import { getStaticData } from "@/firebase/firebaseutils";
import useTranslation from "@/hooks/useTranslation";
import {
  Box,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Heading,
  SimpleGrid,
} from "@chakra-ui/react";
import Head from "next/head";
import React, { useEffect, useState } from "react";

const index = () => {
  const { t } = useTranslation();
  const [article, setArticle] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect( () => {
    const fetchProductsAndSuppliers = async () => {
      try {
      const articlesData = await getStaticData("Articles");
      setArticle(articlesData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products or suppliers:", error);
      setLoading(false);
    }
  };
  fetchProductsAndSuppliers();
}, []);

  return (
    <>
      <Head>
        <title>Articles</title>
      </Head>
      <Container BoxminH={"container.md"} maxW={"container.xl"}>
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
            <Heading
              fontSize={"1.5rem"}
              mb={2}
              color={"blackAlpha.800"}
              fontWeight={400}
            >
              {t("navbar.article")}
            </Heading>
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
                {article.map((res, i) => (
                  <ArticleCard articlesDetails={res} key={i} />
                ))}
              </SimpleGrid>
            )}
          </Box>
        </Grid>
      </Container>
    </>
  );
};

export default index;
