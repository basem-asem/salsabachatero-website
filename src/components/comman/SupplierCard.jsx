import { Box, HStack, Image, Text, Skeleton } from "@chakra-ui/react";
import React, { useState } from "react";
import { Rating } from "@smastrom/react-rating";
import { MdLocationOn } from "react-icons/md";
import Link from "next/link";
import ChakraRating from "./ChakraRatting";

const SupplierCard = ({supplierDetails}) => {
  const [loading, setLoading] = useState(true);
  setTimeout(() => {
    setLoading(false);
  }, 1500);
  console.log(supplierDetails)
    return (
    <>
      <Link href={`/suppliers/${supplierDetails.docid}`}>
        <Box
          boxShadow={"rgba(0, 0, 0, 0.16) 0px 1px 4px;"}
          borderRadius={"md"}
          my="3"
        >
          <Skeleton isLoaded={!loading}>
            <Image borderTopRadius={"md"} w="full" h={"200px"} src={supplierDetails.photo_url} />
          </Skeleton>
          <Box p="2" pb="3">
            <HStack my="0">
            <ChakraRating defaultValue={supplierDetails.averageRating}/>

              
              <Text>{supplierDetails.averageRating}</Text>
            </HStack>
            <Text fontSize={"1.3rem"}>{supplierDetails.display_name}</Text>
            <HStack>
              <MdLocationOn style={{ color: "#FFBB00" }} fontSize={"1.3rem"} />
              <Text color={"blackAlpha.600"} fontSize={"1.3rem"}>
                {supplierDetails.address}
              </Text>
            </HStack>
          </Box>
        </Box>
      </Link>
    </>
  );
};

export default SupplierCard;
