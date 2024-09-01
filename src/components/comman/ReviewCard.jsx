import { Avatar, Box, Divider, HStack, Text } from "@chakra-ui/react";
import { Rating } from "@smastrom/react-rating";
import React, { useState } from "react";
import ChakraRating from "./ChakraRatting";
import { formatDistanceToNow } from "date-fns";
const ReviewCard = ({review,isProduct}) => {
  let relativeTime = 'Invalid date';

  if (review.date) {
    const firebaseTimestamp = review.date;
    const parsedDate = firebaseTimestamp.toDate(); // Convert Firebase timestamp to Date

    if (!isNaN(parsedDate.getTime())) {
      relativeTime = formatDistanceToNow(parsedDate, { addSuffix: true });
    }
  }
  console.log(review)
  return (
    <>
      <HStack my='3' alignItems={"center"}>
        <Avatar src={review.userPhoto} />
        <Box w="full">
          <HStack width={["full"]} justifyContent={"space-between"}>
            <HStack
            gap={0}
              alignItems={"flex-start"}
            //   justifyContent={"flex-start"}
              flexDir={["column", "column", "column", "row"]}
            >
              <Text mr='2' fontSize={"1.1rem"}>{review.userDisplayName}</Text>
              <HStack my="0">
              {/* <Rating
                value={myRating}
                readOnly
                style={{ maxWidth: 110 }}
              /> */}
              <ChakraRating defaultValue={isProduct?review.Rating:
              review.rating
            }/>
              <Text>{isProduct?review.Rating:
              review.rating
            }</Text>
            </HStack>
            </HStack>
            <Text style={{ color: "#808080" }}>{relativeTime}</Text>
          </HStack>
          <TruncatedText
            content={isProduct?review.Review:
              review.review
            }
            maxWords={10}
          />
        </Box>
      </HStack>
      {/* <Divider  height={'10px'}/> */}
    </>
  );
};

export default ReviewCard;

export  function TruncatedText({ content, maxWords }) {
  const words = content.split(" ");
  const truncatedContent = words.slice(0, maxWords).join(" ");
  const shouldShowDots = words.length > maxWords;

  return (
    <div>
      <Text color={"blackAlpha.700"} fontSize={"1rem"}>
    
        {truncatedContent} {shouldShowDots && "..."}
      </Text>
    </div>
  );
}
