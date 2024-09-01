import {
  Container,
  Grid,
  Heading,
  CircularProgress,
  Text,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import ProviderCard from "../comman/ProviderCard";
import useTranslation from "@/hooks/useTranslation";
import { getUsersByType } from "../../firebase/firebaseutils";
import CustomSwiper from "../comman/CustomSwiper";
import { SwiperSlide } from 'swiper/react';
import Link from "next/link";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { useSelector } from "react-redux";

const TrendingBooks = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [faqs, setFaqs] = useState([]);

  const location = useSelector((state) => state.location);

  useEffect(() => {
    const fetchProductsAndSuppliers = async () => {
      setLoading(true); // Set loading to true whenever the city changes
      try {
        const UsersQuery = query(
          collection(db, "users"),
          where("cityforUser", "==", location.city),
          where("Role", "==", "Supplier"),orderBy("SortNumber","asc")
        );
        
        const unsubscribe = onSnapshot(UsersQuery, async (querySnapshot) => {
          const products = querySnapshot.docs.map((d) => ({ docid: d.id, ...d.data() }));
          
          products.forEach((element) => {
            const array = element.rating;
            if (array) {
              const sum = array.reduce(
                (accumulator, currentValue) => accumulator + currentValue,
                0
              );
              const average = sum / array.length;
              if (Array.isArray(array) && array.length > 0) {
                element.averageRating = average.toFixed();
              } else {
                element.averageRating = 0;
              }
            } else {
              element.averageRating = 0;
            }
          });

          setFaqs(products);
          setLoading(false);
        });

        // Clean up the subscription on unmount or city change
        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching products or suppliers:", error);
        setLoading(false);
      }
    };

    fetchProductsAndSuppliers();
  }, [location.city]);

  return (
    <Container my="10" px="0" maxW={"container.xl"}>
      <div
        style={{
          justifyContent: "space-between",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Heading
          my="5"
          fontWeight={400}
          fontSize={['24px',"40px","48px"]}
                    fontFamily={"arboto"}
          style={{ color: "#852830" }}
          textTransform={"uppercase"}
        >
          {t("suppliers")}
        </Heading>
        <Link href={"/suppliers"}>
        <Text fontSize={["20px", "30px"]}>{t("dashboard.viewall")}</Text>
        </Link>
      </div>
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
        <CustomSwiper slide={4} arrowH={"30%"}>
          {faqs.map((res, i) => (
            <SwiperSlide key={i}>
                 <ProviderCard key={i} productDetails={res} />
            </SwiperSlide>
          ))}
        </CustomSwiper>
      )}
    </Container>
  );
};

export default TrendingBooks;

 