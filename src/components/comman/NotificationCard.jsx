import { deleteDocument } from "@/firebase/firebaseutils";
import useTranslation from "@/hooks/useTranslation";
import {
  Avatar,
  Box,
  Button,
  HStack,
  IconButton,
  Menu,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { formatDistanceToNow } from "date-fns";
import React from "react";
import { AiFillCloseCircle } from "react-icons/ai";

const NotificationCard = ({not}) => {
  const { t } = useTranslation();
  let relativeTime = 'Invalid date';

if (not.timePosted) {
  const firebaseTimestamp = not.timePosted;

  // Check if the firebaseTimestamp has a toDate method
  if (firebaseTimestamp.toDate && typeof firebaseTimestamp.toDate === 'function') {
    const parsedDate = firebaseTimestamp.toDate(); // Convert Firebase timestamp to Date

    if (!isNaN(parsedDate.getTime())) {
      relativeTime = formatDistanceToNow(parsedDate, { addSuffix: true });
    }
  }
}

const handleDelete = ()=>{
  deleteDocument("activity",not.docid)
}

  return (
    <>
      <Box
        borderBlock={"1px solid"}
        p="2"
        borderColor={"blackAlpha.400"}
      >
        <HStack w="full" justifyContent={"space-between"} alignItems={"center"}>
          <HStack>
            <Avatar
              size={"md"}
              m="2"
              src={not.picture}
            />

            <Box>
              <Text>{not.name}</Text>
              <Text>{not.description}</Text>
              <Text color={"blackAlpha.600"}>{relativeTime}</Text>
            </Box>
          </HStack>
          <IconButton onClick={handleDelete}>
            <AiFillCloseCircle />
          </IconButton>
        </HStack>
        
      </Box>
    </>
  );
};

export default NotificationCard;
