import React, { useEffect, useState } from "react";
import topImg from "@/../../public/assets/top.png";
import Image from "next/image";
import { Button } from "@chakra-ui/react";
import { CgScrollV } from "react-icons/cg";

  const ScrollToTopButton = () => {
    const [showButton, setShowButton] = useState(false);
  
    const handleScrollToTop = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
  
    const handleScroll = () => {
      setShowButton(window.pageYOffset > 100);
     
    };
  
    useEffect(() => {
      window.addEventListener('scroll', handleScroll);
  
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }, []);

  return (
    <Button
      bg="white"
      boxShadow={"rgba(0, 0, 0, 0.35) 0px 5px 15px;"}
      pos={"fixed"}
      display={showButton ? 'block' : 'none'} 
      bottom={"10px"}
      zIndex={2000}
      right={"20px"}
      onClick={handleScrollToTop}
    >
      <CgScrollV style={{ fontSize: "1.3rem", color: "#FFBB00" }} />
    </Button>
  );
};

export default ScrollToTopButton;

