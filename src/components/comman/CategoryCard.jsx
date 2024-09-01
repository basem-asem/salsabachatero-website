import { Box, Grid, Skeleton, Stack, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { useRouter } from "next/router";
const CategoryCard = ({ data }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  setTimeout(() => {
    setLoading(false);
  }, 1000);
  return (
      <Stack
        mx={2}
        // justifyContent={"space-evenly"}
        onClick={() => router.push(`/subcategory/${data.docid}`)}
        cursor={"pointer"}
        width={"150px"}
        height={"200px"}
        gap={0}
        >
        <Skeleton isLoaded={!loading} w={"auto"}>
          <img
            style={{ margin: "0", width: "150px", height: "100px" }}
            src={data.categoryImage}
          />
        </Skeleton>
        <Text
          textAlign={"center"}
          fontSize={"1.1rem"}
          color={"white"}
          backgroundColor={"#852830"}
          w={"150px"}
          >
          {data.nameEN}
        </Text>
      </Stack>
  );
};

export default CategoryCard;
