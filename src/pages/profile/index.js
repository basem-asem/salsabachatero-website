import Profile from "@/components/profile/Profile";
import { Container } from "@chakra-ui/react";
import Head from "next/head";
import React from "react";

const index = () => {
  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <Container minH={"container.md"} maxW={"container.xl"}>
        <Profile />
        
      </Container>
    </>
  );
};

export default index;
