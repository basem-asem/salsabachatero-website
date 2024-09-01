import {
    Card,
    CardBody,
    Heading,
    Stack,
    Text,
    Image,
    Skeleton,
    CardFooter,
    ButtonGroup,
    Button,
    Box,
  } from "@chakra-ui/react";
  import React, { useState, useEffect } from "react";
  import {
    AiFillHeart,
    AiOutlineShoppingCart,
    AiOutlineHeart,
  } from "react-icons/ai";
  import { Rating } from "@smastrom/react-rating";
  import useTranslation from "@/hooks/useTranslation";
  import Link from "next/link";
  
  const AdsCard = ({ productDetails }) => {
    const [rating] = useState(3.5);
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [isClicked, setIsClicked] = useState(false);
  
    useEffect(() => {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    }, []);
  
    const handleClick = () => {
      setIsClicked(!isClicked);
    };
  
    return (
      <>
      <Link href={productDetails.websiteLink}>

      <Image
      display={"block"}
      width={"100% !important"}
      height={["50vh","80vh"]}
      src={productDetails.imageLink}
      />
      </Link>
      </>
    );
  };
  
  export default AdsCard;
  