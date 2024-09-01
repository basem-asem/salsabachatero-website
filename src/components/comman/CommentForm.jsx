import { useRef, useState } from "react";
import {
  Button,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogCloseButton,
  AlertDialogBody,
  AlertDialogFooter,
  Textarea,
} from "@chakra-ui/react";
import { db } from "@/firebase/firebase";
import { doc, setDoc } from "firebase/firestore";
import useTranslation from "@/hooks/useTranslation";
import { createOrUpdateSubcollectionDoc } from "@/firebase/firebaseutils";

export default function CommentForm({ onClose, isOpen, name, id, userRef }) {
  const cancelRef = useRef();
  const { t } = useTranslation();
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleClick = async () => {
    setLoading(true);
    setError(null);
    const idRef = doc(db, "Articles", id);
    try {
      const reviewData = {
        review,
        userID: userRef,
        date: new Date(),
      };
      await createOrUpdateSubcollectionDoc("Articles", idRef, "Comments", reviewData);
      onClose();
    } catch (error) {
      console.error("Error submitting review:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
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
        <AlertDialogCloseButton />
        <AlertDialogBody>
          <Textarea
            my="2"
            placeholder={t("write")}
            width={"full"}
            value={review}
            onChange={(e) => setReview(e.target.value)}
          />
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </AlertDialogBody>
        <AlertDialogFooter>
          <Button ref={cancelRef} ml="2" onClick={onClose} isDisabled={loading}>
            {t("cancel")}
          </Button>
          <Button bg="#822727" color={"white"} ml={3} onClick={handleClick} isLoading={loading}>
            {t("fomr.submit")}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
