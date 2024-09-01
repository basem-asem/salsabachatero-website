import { Container, Grid, Heading, CircularProgress } from "@chakra-ui/react";
import React, { useState, useEffect, useRef } from "react";
import AdsCard from "../comman/AdsCard";
import useTranslation from "@/hooks/useTranslation";
import CustomSwiper from "../comman/CustomSwiper";
import { useSelector } from "react-redux";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules"; // Updated import path
import { IconButton } from "@chakra-ui/react";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";

const Ads = () => {
  const { t } = useTranslation();
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useSelector((state) => state.location);
  const swiperRef = useRef(null);

  useEffect(() => {
    const UsersQuery = query(
      collection(db, "AdminAdvertise"),
      where("active", "==", true),
      where("city", "==", location.city)
    );

    const unsubscribe = onSnapshot(UsersQuery, (querySnapshot) => {
      setFaqs(querySnapshot.docs.map((d) => ({ docid: d.id, ...d.data() })));
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [location]);

  return (
    <Container my="10" px="0" maxW={"container.xl"}>
      {loading ? (
        <Grid
          xs={12}
          textAlign="center"
          style={{ justifyContent: "center", display: "flex" }}
        >
          <CircularProgress isIndeterminate />
        </Grid>
      ) : faqs.length > 0 ? (
        <div style={{ position: "relative", width: "200px !important" }}>
          <Swiper
            spaceBetween={30}
            slidesPerView={1}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            navigation={false}
            modules={[Navigation]} // Specify the modules here
          >
            {faqs.map((res, i) => (
              <SwiperSlide key={i}>
                <AdsCard productDetails={res} />
              </SwiperSlide>
            ))}
          </Swiper>
          <IconButton
            aria-label="Previous Image"
            icon={<AiOutlineLeft />}
            position="absolute"
            top={"50%"}
            left="10px"
            transform="translateY(-50%)"
            onClick={() => swiperRef.current?.slidePrev()}
            zIndex={1}
            bg="rgba(255, 255, 255, 0.7)"
            _hover={{ bg: "white" }}
          />
          <IconButton
            aria-label="Next Image"
            icon={<AiOutlineRight />}
            position="absolute"
            top={"50%"}
            right="10px"
            transform="translateY(-50%)"
            onClick={() => swiperRef.current?.slideNext()}
            zIndex={1}
            bg="rgba(255, 255, 255, 0.7)"
            _hover={{ bg: "white" }}
          />
        </div>
      ) : (
        <Heading textAlign="center">{t("No ads available")}</Heading>
      )}
    </Container>
  );
};

export default Ads;
