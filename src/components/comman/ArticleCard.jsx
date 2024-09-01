import useTranslation from "@/hooks/useTranslation";
import {
  Box,
  Skeleton,
  Image,
  Text,
  HStack,
  Divider,
  Grid,
} from "@chakra-ui/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { TruncatedText } from "./ReviewCard";

const ArticleCard = ({articlesDetails}) => {
  const { t } = useTranslation();
  const [imageLoaded, setImageLoaded] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setImageLoaded(false);
    }, 1000);
  }, []);
    return (
    <>
<Link href={`/profile/article/${articlesDetails.docid}`}>
<Box
      cursor={'pointer'}
        my="5"
        px={"3"}
        py="1"
        boxShadow={"rgba(0, 0, 0, 0.16) 0px 1px 4px;"}
        borderRadius={"md"}
      >
        <HStack my="2" flexDirection={["column",'column','row']}>
          <Skeleton
            borderRadius={"md"}
            isLoaded={!imageLoaded}
            height={"130px"}
            width="150px"
          >
            <Image
              objectFit="cover"
              loading="lazy"
              width={"150px"}
              height={"130px"}
              borderRadius={"md"}
              src={articlesDetails.article_image}
            />
          </Skeleton>
          <Box w="80%">
            <Text my="1" fontSize={["1rem", "1rem", "1.2rem"]}>
              {articlesDetails.title}
            </Text>
           
              <TruncatedText
                content={articlesDetails.description}
                maxWords={40}
              />
 
          </Box>
        </HStack>
      </Box>
</Link>
    </>
  );
};

export default ArticleCard;
