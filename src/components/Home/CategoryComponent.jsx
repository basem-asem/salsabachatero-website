import { Container, HStack, Heading, SimpleGrid, CircularProgress, Grid, Center, Box } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import CategoryCard from "../comman/CategoryCard";
import useTranslation from "@/hooks/useTranslation";
import {getStaticData} from "../../firebase/firebaseutils";


const CategoryComponent = () => {
  const { t } = useTranslation();
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStaticData("category").then((allfaqs) => {
      setFaqs(allfaqs);
      setLoading(false);
    });
  }, []);

  return (
    <>
      <Container my="10" px="0" maxW={"container.xl"}>
        
        <Heading my="5" fontWeight={400} fontSize={['30px',"48px"]} fontFamily={"arboto"} style={{color: "#852830" }}>
          {t("shop")}
        </Heading>
        {/* <HStack px='0' w="full" justifyContent={['flex-start','center','center','flex-start']} flexWrap={"wrap"}> */}
        {loading ? (
        <Grid item xs={12} textAlign="center" style={{justifyContent: "center", display: "flex"}}>
          <CircularProgress isIndeterminate />
        </Grid>) : (
          <>
          <SimpleGrid columns={[2,3,4,6,8]}  w={"auto"} gap={2} >
          {faqs.map((res, i) => {
            return <CategoryCard key={i} data={res} />;
          })}
          </SimpleGrid>
          </>
          )}
        {/* </HStack> */}
      </Container>
    </>
  );
};

export default CategoryComponent;
