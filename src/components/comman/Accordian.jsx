import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
} from "@chakra-ui/react";
import React from "react";
import { BiPlus, BiMinus } from "react-icons/bi";
const Accordian = ({que}) => {
    
  return (
    <>
      <Accordion
        boxShadow={"rgba(0, 0, 0, 0.16) 0px 1px 4px;"}
        bg="white"
        width={"full"}
        allowMultiple
      >
        <AccordionItem width={"full"}>
          {({ isExpanded }) => (
            <>
              <h2>
                <AccordionButton>
                {isExpanded ? (
                    <Box mx={2} mr={5} borderRadius={"3px"} bg="#FFFD40" p="2">
                      <BiMinus fontSize="22px"/>
                    </Box>
                  ) : (
                    <Box mx={2} mr={5} borderRadius={"3px"} bg="#FFFD40" p="2">
                        <BiPlus fontSize="22px"/>
                    </Box>
                  )}
                  <Box
                    as="span"
                    flex="1"
                    fontSize={"1.1rem"}
                    fontWeight={500}
                    textAlign="left"
                    color={"#101010"}
                  >
                  {que}
                  </Box>
                </AccordionButton>
              </h2>
              <AccordionPanel color={"blackAlpha.600"} pb={4}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
              </AccordionPanel>
            </>
          )}
        </AccordionItem>
      </Accordion>
    </>
  );
};

export default Accordian;
