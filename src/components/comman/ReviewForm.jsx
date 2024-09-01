import { db } from "@/firebase/firebase";
import { createOrUpdateSubcollectionDoc } from "@/firebase/firebaseutils";
import useTranslation from "@/hooks/useTranslation";
import { Rating } from "@smastrom/react-rating";
import { doc } from "firebase/firestore";
import { useRef, useState } from "react";

const {
  Button,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogCloseButton,
  AlertDialogBody,
  AlertDialogFooter,
  Textarea,
} = require("@chakra-ui/react");

export default function ReviewForm({ onClose, isOpen, name, id, userRef ,isProduct=false}) {
  const cancelRef = useRef();
  const { t } = useTranslation();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleClick = async () => {
    if(isProduct){
      setLoading(true);
    setError(null);
    const idRef = doc(db, "Products", id);
    try {
      const reviewData = {
        Review:review,
        Rating:rating,
        userID: userRef,
        date: new Date(),
      };
      await createOrUpdateSubcollectionDoc(
        "Products",
        idRef,
        "Reviews",
        reviewData
      );
      onClose();
    } catch (error) {
      console.error("Error submitting review:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
    }else{

      setLoading(true);
      setError(null);
      const idRef = doc(db, "users", id);
      try {
        const reviewData = {
          review,
          rating,
          supplierID:idRef,
          userID: userRef,
          date: new Date(),
        };
      await createOrUpdateSubcollectionDoc(
        "users",
        idRef,
        "Ratings",
        reviewData
      );
      onClose();
    } catch (error) {
      console.error("Error submitting review:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }
  };
  
  console.log(rating)
  return (
    <>
      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>{name}</AlertDialogHeader>

          <AlertDialogBody>
            
            <Rating
              style={{ maxWidth: 140 }}
              value={rating}
              onChange={setRating}
            />
            <Textarea
              my="2"
              resize={"none"}
              placeholder={t("write")}
              width={"full"}
              onChange={(e) => setReview(e.target.value)}
            />
            {error && <p style={{ color: 'red' }}>{error}</p>}
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} ml="2" onClick={onClose}>
              {t("cancel")}
            </Button>
            <Button bg="#822727" color={"white"} ml={3} onClick={handleClick} isLoading={loading}>
              {t("fomr.submit")}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
