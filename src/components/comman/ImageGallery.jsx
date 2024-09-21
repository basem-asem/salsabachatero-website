import React, { useEffect, useState } from "react";
import useTranslation from "@/hooks/useTranslation";
import {
  Box,
  CircularProgress,
  Grid,
  HStack,
  Icon,
  Text,
} from "@chakra-ui/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { doc, getDoc } from "firebase/firestore"; // Import Firestore utilities
import { db } from "@/firebase/firebase";
import { IoIosPin } from "react-icons/io";
import Link from "next/link";

const ImageGallery = ({ fav, events, course }) => {
  const { t } = useTranslation();
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
console.log(events);
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (fav === true) {
          const userId = localStorage.getItem("userId");
          const userRef = doc(db, "users", userId);
          const userDoc = await getDoc(userRef);

          if (userDoc.exists()) {
            const favoriteEventIds = userDoc.data().favorites || [];

            // Now query the events collection to fetch the favorite events
            const favoriteEvents = await Promise.all(
              favoriteEventIds.map(async (eventId) => {
                const eventRef = doc(db, "events", eventId);
                const eventDoc = await getDoc(eventRef);

                // Return the event data along with its docid
                return eventDoc.exists() ? { docid: eventId, ...eventDoc.data() } : null;
              })
            );

            setImages(favoriteEvents.filter((event) => event !== null));
          }
        } else if(course == true) {
          // Fetch non-favorite events by ids
          const eventsResult = await Promise.all(
            events.map(async (id) => {
              const eventRef = doc(db, "courses", id);
              const eventDoc = await getDoc(eventRef);
              return eventDoc.exists() ? { docid: id, ...eventDoc.data() } : null;
            })
          );

          setImages(eventsResult.filter((event) => event !== null));
        }else{
          
          // Fetch non-favorite events by ids
          const eventsResult = await Promise.all(
            events.map(async (id) => {
              const eventRef = doc(db, "events", id);
              const eventDoc = await getDoc(eventRef);
              return eventDoc.exists() ? { docid: id, ...eventDoc.data() } : null;
            })
          );

          setImages(eventsResult.filter((event) => event !== null));
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [fav, events,course]);

  return (
    <Box width={"full"}>
      <HStack style={{ display: "block" }}>
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
              effect={"coverflow"}
              loop={true}
              grabCursor={true}
              centeredSlides={true}
              coverflowEffect={{
                rotate: 40,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: true,
              }}
              breakpoints={{
                0: { spaceBetween: 20, slidesPerView: 1 },
                640: { spaceBetween: 20, slidesPerView: 2 },
                768: { spaceBetween: 30, slidesPerView: 3 },
                1024: { spaceBetween: 40, slidesPerView: 4 },
              }}
              pagination={false}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              modules={[EffectCoverflow, Pagination, Autoplay]}
              className="mySwiper"
            >
              {images.map((img, i) => (
                <SwiperSlide
                  key={i}
                  className="gallery"
                  style={{
                    position: "relative",
                    marginTop: "30px",
                    borderRadius: "8px",
                  }}
                >
                  <Link href={`/eventDetalis/${img.docid}`}>
                    <img
                      src={img.eventPhoto}
                      alt={`Slide ${i}`}
                      style={{ height: "75vh", borderRadius: "10px" }}
                    />
                    {/* Black overlay at the bottom */}
                    <Box
                      position="absolute"
                      bottom="0"
                      width="100%"
                      bgGradient="linear(to-t, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0))"
                      p={3}
                      color="white"
                      borderRadius={10}
                    >
                      <Text fontSize="lg" fontWeight="semibold">
                        {img.title}
                      </Text>
                      <Box display={"flex"}>
                        {img?.type.map((typ, i) => (
                          <React.Fragment key={i}>
                            <Text
                              mx="1"
                              fontSize="sm"
                              fontWeight="semibold"
                              color="white"
                            >
                              {typ}
                            </Text>
                            {i < img.type.length - 1 && <Text>/</Text>}
                          </React.Fragment>
                        ))}
                      </Box>
                     {course?(
                       <Text fontSize="sm">
                       Price Per {img.PaymentTime}: {img.event}{" "}
                       {img.currency === "Euro" ? "€" : "$"}
                       </Text>
                     ):(
                       <Text fontSize="sm">
                       Price Entry: {img.event}{" "}
                       {img.currency === "Euro" ? "€" : "$"}
                       </Text>
                      )
                    }
                      <Text fontSize="sm">
                        {new Date(img.date.seconds * 1000).toLocaleString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}{" "}
                        -{" "}
                        {new Date(img.closeDate.seconds * 1000).toLocaleString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </Text>
                      <Text
                        fontSize="sm"
                        whiteSpace="nowrap"
                        overflow="hidden"
                        textOverflow="ellipsis"
                        display="flex"
                        alignItems="center"
                      >
                        <Icon as={IoIosPin} w={5} h={5} color="white" />{" "}
                        {img.location}
                      </Text>
                      <Text
                        fontSize="sm"
                        overflow="hidden"
                        display="-webkit-box"
                        sx={{
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                        }}
                        textOverflow="ellipsis"
                      >
                        {img.description}
                      </Text>
                    </Box>
                  </Link>
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
