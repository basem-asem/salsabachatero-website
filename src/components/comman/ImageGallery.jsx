import React, { useEffect, useState } from "react";
import useTranslation from "@/hooks/useTranslation";

import { Box, CircularProgress, Grid, HStack, Text } from "@chakra-ui/react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import { getStaticData } from "@/firebase/firebaseutils";

const ImageGallery = () => {
  const { t } = useTranslation();
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getStaticData("Gallery").then((image) => {
      setImages(image);
      setIsLoading(false);
    });
  }, []);
  
  return (
    <Box width={"full"} >
      <HStack my={7} style={{ display: "block" }}>
      <Text  my="8" fontWeight={400} fontSize={['24px',"40px","48px"]} fontFamily={"arboto"} style={{color: "#852830" }}>{t("ImageGallary")}</Text>

        <HStack display={"flex"} justifyContent={"center"}>
          {isLoading ? (
            <Grid
            item
            xs={12}
            textAlign="center"
            style={{ justifyContent: "center", display: "flex" }}
          >
            <CircularProgress isIndeterminate />
          </Grid>
          ) : (
            <Swiper
              effect={'coverflow'}
              loop={true}
              grabCursor={true}
              centeredSlides={true}
              slidesPerView={'auto'}
              coverflowEffect={{
                rotate: 40,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: true,
              }}
              pagination={false}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              modules={[EffectCoverflow, Pagination, Autoplay]}
              className="mySwiper"
            >
              {images.map((img, i) => (
                <SwiperSlide key={i} className="galley">
                  <img src={img.image} alt={`Slide ${i}`} />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </HStack>
      </HStack>
    </Box>
  );
};

export default ImageGallery;
