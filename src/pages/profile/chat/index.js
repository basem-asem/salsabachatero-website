import Chat from "@/components/chat/Chat";
import { Container } from "@chakra-ui/react";
import Head from "next/head";
import React from "react";

const index = () => {
  return (
    <>
      <Head>
        <title>Chat</title>
      </Head>
      <Container minH={'container.md'} maxW={'container.xl'}>
        <Chat />
      </Container>
    </>
  );
};

export default index
