import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules"; // Updated import path
import { IconButton } from "@chakra-ui/react";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";

// No need to use SwiperCore.use anymore in newer versions of Swiper

const CustomSwiper = ({ children, slide, arrowH }) => {
  const swiperRef = useRef(null);

  return (
    <div style={{ position: "relative", width: "200px !important" }}>
      <Swiper
        spaceBetween={30}
        slidesPerView={slide}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        navigation={false}
        breakpoints={{
          0: { spaceBetween: 20,slidesPerView: 1, },
          640: { spaceBetween: 20,slidesPerView: 2, },
          768: { spaceBetween: 40 ,slidesPerView: 3,},
          1024: { spaceBetween: 50,slidesPerView: 4, },
          1200: { spaceBetween: 30,slidesPerView: 5, },
        }}
        
        modules={[Navigation]} // Specify the modules here
      >
        {children}
      </Swiper>
      <IconButton
        aria-label="Previous Image"
        icon={<AiOutlineLeft />}
        position="absolute"
        top={arrowH}
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
        top={arrowH}
        right="10px"
        transform="translateY(-50%)"
        onClick={() => swiperRef.current?.slideNext()}
        zIndex={1}
        bg="rgba(255, 255, 255, 0.7)"
        _hover={{ bg: "white" }}
      />
    </div>
  );
};

export default CustomSwiper;
