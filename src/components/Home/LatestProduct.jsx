import {
  Container,
  Grid,
  Heading,
  CircularProgress,
  Text,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import ProductCard from "../comman/ProductCard";
import useTranslation from "@/hooks/useTranslation";
import { getUserDataByRef } from "../../firebase/firebaseutils";
import CustomSwiper from "../comman/CustomSwiper";
import { SwiperSlide } from 'swiper/react';
import Link from "next/link";
import { useSelector } from "react-redux";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { db } from "@/firebase/firebase";

const LatestProduct = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [faqs, setFaqs] = useState([]);
  const location = useSelector((state) => state.location);

  useEffect(() => {
    const fetchProductsAndSuppliers = async () => {
      setLoading(true);
      console.log("Fetching products for city:", location.city);
      try {
        const UsersQuery = query(
          collection(db, "Products"),
          where("city", "==", location.city),
          where("isShow", "==", true),
          orderBy("sortNumber", "desc")
        );

        const unsubscribe = onSnapshot(UsersQuery, async (querySnapshot) => {
          const products = querySnapshot.docs.map((d) => ({ docid: d.id, ...d.data() }));
          console.log("Products fetched:", products);

          const productsWithSupplierData = await Promise.all(
            products.map(async (product) => {
              const array = product.rating;
              if (array) {
                const sum = array.reduce(
                  (accumulator, currentValue) => accumulator + currentValue,
                  0
                );
                const average = sum / array.length;
                product.averageRating = average || 0;
              } else {
                product.averageRating = 0;
              }

              // Fetch supplier data if supplier is a Firestore reference
              if (product.supplier) {
                try {
                  const supplierData = await getUserDataByRef(product.supplier);
                  product.supplierDisplayName = supplierData.display_name;
                } catch (error) {
                  console.error(`Error fetching supplier data for product ${product.docid}:`, error);
                  product.supplierDisplayName = "Unknown Supplier";
                }
              } else {
                product.supplierDisplayName = "Unknown Supplier";
              }

              return product;
            })
          );
          console.log(productsWithSupplierData)

          setFaqs(productsWithSupplierData);
          setLoading(false);
          console.log("Products with supplier data:", productsWithSupplierData);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching products or suppliers:", error);
        setLoading(false);
      }
    };

    fetchProductsAndSuppliers();
  }, [location.city]);
console.log(faqs)
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
          {t("latest.book")}
        </Heading>
        <Link href={"/products"} style={{width:"auto"}}>
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
              <ProductCard productDetails={res} />
            </SwiperSlide>
          ))}
        </CustomSwiper>
      )}
    </Container>
  );
};

export default LatestProduct;
