import { Box, Container, Text } from "@chakra-ui/react";
import React from "react";
import { AiFillWarning } from "react-icons/ai";
const Warn = ({ message }) => {
  return (
    <>
      <Container
        maxW={"container.xl"}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
        w="full"
        minH={"container.sm"}
      >
        <Box>
          <AiFillWarning
            style={{ fontSize: "8rem", marginInline: "auto", color: "#FFBB00" }}
          />
          <Text fontSize={"2rem"}>{message}</Text>
        </Box>
      </Container>
    </>
  );
};

export default Warn;
