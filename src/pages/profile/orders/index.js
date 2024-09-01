import Orders from "@/components/orders/Orders";
import { Container } from "@chakra-ui/react";
import Head from "next/head";
import React from "react";

const index = () => {
  return (
    <>
      <Head>
        <title>Orders</title>
      </Head>
      <Container minH={"container.md"} maxW={"container.xl"}>
        <Orders />
      </Container>
    </>
  );
};

export default index;
