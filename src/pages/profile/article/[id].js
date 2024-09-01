import CommentCard from "@/components/comman/CommentCard";
import CommentForm from "@/components/comman/CommentForm";
import ReviewCard from "@/components/comman/ReviewCard";
import ReviewForm from "@/components/comman/ReviewForm";
import ProfileSidebar from "@/components/profile/ProfileSidebar";
import useTranslation from "@/hooks/useTranslation";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Heading,
  Image,
  SimpleGrid,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getDocumentData } from "@/firebase/firebaseutils";
import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/firebase";

const ArticleDetail = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const { id } = router.query;
  const [article, setArticle] = useState([]);
  const [review, setReview] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const userDataString = localStorage.getItem("userdata");
    if (userDataString) {
      const parsedUserData = JSON.parse(userDataString);
      const Ref = doc(db, "users", parsedUserData.uid)
      setUserData(Ref);
    }
  }, []);

  useEffect(() => {
    const fetchProductsAndSuppliers = async () => {
      try {
        const articlesData = await getDocumentData("Articles", id);
        setArticle(articlesData);
        setLoading(false);
  
        // Comments
        const productRef = doc(db, "Articles", id);
        const reviewsRef = collection(productRef, "Comments");
  
        // Watch for changes in the "Comments" subcollection
        const unsubscribe = onSnapshot(reviewsRef, async (snapshot) => {
          const reviewPromises = snapshot.docs.map(async (doc) => {
            const reviewData = doc.data();
            const userData = await getDoc(reviewData.userID);
            if (userData.exists() && userData.data().display_name) {
              const userDisplayName = userData.data().display_name;
              const userPhoto = userData.data().photo_url;
              return {
                id: doc.id,
                userDisplayName: userDisplayName,
                userPhoto: userPhoto,
                ...reviewData,
              };
            } else {
              return null;
            }
          });
  
          const reviews = (await Promise.all(reviewPromises)).filter(
            (review) => review !== null
          );
  
          // Sort reviews by date, assuming the date field is named 'date'
          const sortedReviews = reviews.sort((a, b) => {
            return b.date.toDate() - a.date.toDate();
          });
  
          setReview(sortedReviews);
        });
  
        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching products or suppliers:", error);
        setLoading(false);
      }
    };
  
    fetchProductsAndSuppliers();
  }, [id]);
  

  const { isOpen, onClose, onOpen } = useDisclosure();
  console.log(userData)
  return (
    <>
      <Container BoxminH={"container.md"} maxW={"container.xl"}>
        <Grid
          templateColumns={["3fr", "3fr", "3fr", "1fr 3fr"]}
          my="7"
          minH={"container.sm"}
          gap={2}
        >
          <ProfileSidebar />
          <Box
            p={["3", "3", "5"]}
            sx={{
              "&::-webkit-scrollbar": {
                width: "8px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "blackAlpha.300",
                borderRadius: "4px",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                backgroundColor: "blackAlpha.300",
              },
            }}
            border="1px solid"
            overflowY={"auto"}
            maxH={"container.md"}
            borderRadius={"md"}
            borderColor={"blackAlpha.400"}
          >
            <Heading
              fontSize={"1.5rem"}
              mb={2}
              color={"blackAlpha.800"}
              fontWeight={400}
            >
              {t("article.detail")}
            </Heading>
            <Divider />
            <Box my="4">
              <Box
                width={["full", '200px']}
                height={"150px"}
                float={["none", "left"]}
                mx={['0', '5']}
              >
                <Image
                  src={article.article_image}
                  borderRadius={"md"}
                  style={{ width: "100%", height: "100%" }}
                  alt="logo"
                />
              </Box>
              <Box my={['2', '0']}>
                <Text fontSize={"1.2rem"} fontWeight={500}>
                  {article.title}
                </Text>
                <Text
                  p={["0", "5px"]}
                  py="10px"
                  fontSize={"1rem"}
                  color={"blackAlpha.700"}
                  lineHeight={"8"}
                >
                  {article.description}
                </Text>
              </Box>
              <Button
                boxShadow={"rgba(0, 0, 0, 0.16) 0px 1px 4px;"}
                w="full"
                my="4"
                onClick={onOpen}
                fontSize={"24px"}
                color={"#FFBB00"}
                fontWeight={400}
                bg="white"
                disabled={!userData}
              >
                {t("add.comment")}
              </Button>
            </Box>
            {loading ? (
              <Grid
                item
                xs={12}
                textAlign="center"
                style={{ justifyContent: "center", display: "flex" }}
              >
                <CircularProgress isIndeterminate />
              </Grid>
            ) : (
              <SimpleGrid>
                {review.map((res, i) => (
                  <CommentCard commentDetails={res} key={i} />
                ))}
              </SimpleGrid>
            )}
          </Box>
        </Grid>
        {userData && (
          <CommentForm
            name={t("add.comment")}
            onClose={onClose}
            isOpen={isOpen}
            id={id}
            userRef={userData}
          />
        )}
      </Container>
    </>
  );
};

export default ArticleDetail;
