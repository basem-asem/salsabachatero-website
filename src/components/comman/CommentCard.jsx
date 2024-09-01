import { Avatar, Box, HStack,Text } from '@chakra-ui/react'
import React from 'react'
import { TruncatedText } from './ReviewCard'
import { formatDistanceToNow } from 'date-fns';

const CommentCard = ({commentDetails}) => {
  let relativeTime = 'Invalid date';

  if (commentDetails.date) {
    const firebaseTimestamp = commentDetails.date;
    const parsedDate = firebaseTimestamp.toDate(); // Convert Firebase timestamp to Date

    if (!isNaN(parsedDate.getTime())) {
      relativeTime = formatDistanceToNow(parsedDate, { addSuffix: true });
    }
  }
  return (
    <>
      <HStack my='3' alignItems={"center"}>
        <Avatar src={commentDetails.userPhoto} />
        <Box w="full">
          <HStack width={["full"]} justifyContent={"space-between"}>
            <HStack
            gap={0}
              alignItems={"flex-start"}
            //   justifyContent={"flex-start"}
              flexDir={["column", "column", "column", "row"]}
            >
              <Text mr='2' fontSize={"1.1rem"}>{commentDetails.userDisplayName}</Text>
             
            </HStack>
            <Text style={{ color: "#808080" }}>{relativeTime}</Text>
          </HStack>
          <TruncatedText
            content={commentDetails.review}
            maxWords={8}
          />
        </Box>
      </HStack>
    </>
  )
}

export default CommentCard
