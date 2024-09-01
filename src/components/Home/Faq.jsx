import useTranslation from "@/hooks/useTranslation";
import { Container, HStack, Heading } from "@chakra-ui/react";
import React from "react";
import Accordian from "../comman/Accordian";

const Faq = () => {
  const { t } = useTranslation();
  let arr = ["How can i pay for my order?","How to register on this platform?","What is your cancellation policy?"];
  return (
    <>
      <Container my="10" px="0" maxW={"container.xl"}>
        <Heading textAlign={"center"} my="5" fontWeight={500} fontSize={"30px"}>
          {t("question")}
        </Heading>
        <HStack w="full" flexWrap={"wrap"}>
        {
            arr.map((res,i)=>{
                return   <Accordian key={i} que={res}/>
            })
        }
        </HStack>
      </Container>
    </>
  );
};

export default Faq;
