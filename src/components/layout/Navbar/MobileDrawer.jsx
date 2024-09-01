import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  HStack,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import { DocumentCollapse } from "./DocumentCollapse";
import { ToggleButton } from "./ToggleButton";
import { useRouter } from "next/router";
import useTranslation from "@/hooks/useTranslation";
import { BsBoxSeam } from "react-icons/bs";
import { MdOutlineAddLocationAlt } from "react-icons/md";
import { PiWechatLogoLight } from "react-icons/pi";
import { GrGallery } from "react-icons/gr";
import { AiOutlinePoweroff, AiOutlineUser } from "react-icons/ai";
import { FcAbout } from "react-icons/fc";
import { FaQuestion, FaShoppingCart } from "react-icons/fa";
import { RiArticleLine } from "react-icons/ri";
import { FiSettings } from "react-icons/fi";
import styled from "styled-components";
import { auth } from "@/firebase/firebase";
import { AiFillHome,AiFillHeart  } from "react-icons/ai";
import { IoSettingsOutline } from "react-icons/io5";


const StyledFcAbout = styled(FcAbout)`
  font-size: 1.7rem;
  & path {
    fill: black;
  }
`;
export const MobileDrawer = () => {
  const { isOpen, onToggle, onClose } = useDisclosure();
  const { t } = useTranslation();
  const router = useRouter();
  let linkArr = [
    {
      name: t("home"),
      link: "/home",
      icon:<AiFillHome fontSize={"1.7rem"}/>
    },
    {
      name: t("Favourite"),
      icon:<AiFillHeart fontSize={"1.7rem"}/>,
      link: "/favourite",
    },
    {
      name: t("Cart"),
      icon:<FaShoppingCart fontSize={"1.7rem"}/>,
      link: "/cart",
    },
    {
      name: t("user.profile"),
      icon: <AiOutlineUser fontSize={"1.7rem"} />,
      link: "/profile",
    },
    {
      name: t("orders"),
      icon: <BsBoxSeam fontSize={"1.5rem"} />,
      link: "/profile/orders",
    },
    {
      name: t("chat"),
      icon: <PiWechatLogoLight fontSize={"1.7rem"} />,
      link: "/profile/chat",
    },
    {
      name: t("navbar.address"),
      icon: <MdOutlineAddLocationAlt fontSize={"1.7rem"} />,
      link: "/profile/address",
    },
    {
      name: t("navbar.article"),
      icon: <RiArticleLine fontSize={"1.7rem"} />,
      link: "/profile/article",
    },
    {
      name: t("navbar.imagegallery"),
      icon: <GrGallery fontSize={"1.7rem"} />,
      link: "/profile/offers",
    },
    {
      name: t("navabar.FAQs"),
      icon: <FaQuestion fontSize={"1.7rem"} />,
      link: "/profile/faq",
    },
    {
      name: t("navbar.about"),
      icon: <StyledFcAbout />,
      link: "/profile/about",
    },
    {
      name: t("Settings"),
      icon: <IoSettingsOutline fontSize={"1.7rem"}/>,
      link: "/profile/settings",
    },
  ];
  const handleClick = async () => {
    try {
      await auth
      .signOut();
      localStorage.clear();
      router.push('/');
    } catch (error) {
      console.error("Error during sign out:", error);
    }
  };
  return (
    <>
      <ToggleButton
        isOpen={isOpen}
        onClick={onToggle}
        aria-label="Open menu"
        display={{ base: "inline-flex", lg: "none" }}
      />
      <Drawer placement={router.locale == 'en'?'left':"right"} isOpen={isOpen} onClose={onClose}>
        <DrawerContent zIndex={5000}>
          <DrawerBody mt="72px" p="4">
            <Stack spacing="1">
              {linkArr.map((res,i) => {
                return (
                  <Button
                  key={i}
                    color={"blackAlpha.700"}
                    onClick={() => {
                      router.push(res.link);
                      onClose();
                    }}
                    size="lg"
                    variant="tertiary"
                    justifyContent="start"
                  >
                 <span style={{marginInline:"10px"}}>
                 {res.icon} </span> {res.name}
                  </Button>
                );
              })}
            </Stack>
          </DrawerBody>
          <DrawerFooter>
            <Button textAlign={"center"} w="full" onClick={handleClick} colorScheme="red">
              {t("user.logout")}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};
