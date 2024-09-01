import {
  Box,
  Button,
  Grid,
  HStack,
  Heading,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Switch,
} from "@chakra-ui/react";
import React, { useState } from "react";
import ProfileSidebar from "../profile/ProfileSidebar";
import useTranslation from "@/hooks/useTranslation";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useRouter } from "next/router";

const Setting = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [language, setLanguage] = useState("en");
  const togglePasswordEye = () => {
    setShowPassword(!showPassword);
  };
  const toggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  const toggleOldPasswordEye = () => {
    setShowOldPassword(!showOldPassword);
  };
  const { t } = useTranslation();
  const router = useRouter();
  const [value, setValue] = useState(
    router.locale == "en" ? "english" : "arabic"
  );
  const languageHandler = () => {
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem("language", value);
      setLoading(false);
      router.push("/login");
    }, 1500);
  };
  return (
    <>
      <Grid
        templateColumns={["3fr", "3fr", "3fr", "1fr 3fr"]}
        my="7"
        minH={"container.sm"}
        gap={2}
      >
        <ProfileSidebar />
        <Box
          pos={"relative"}
          p={["3",'3','5']}
          border="1px solid"
          borderRadius={"md"}
          borderColor={"blackAlpha.400"}
        >
          <Heading
            my="4"
            fontWeight={400}
            color={"blackAlpha.800"}
            fontSize={"1.4rem"}
          >
            {t("change.password")}
          </Heading>
          <form>
            <Box my="3">
              <Box pos={"relative"}>
                <Input
                  placeholder={t("old.password")}
                  name="oldPassword"
                  _focusVisible={"none"}
                  type={showOldPassword ? "text" : "password"}
                  id="oldPassword"
                  fontSize={"1.1rem"}
                />
                <Button
                  variant={"unstyled"}
                  onClick={toggleOldPasswordEye}
                  pos={"absolute"}
                  top={"0"}
                  zIndex={1000}
                  fontSize={"1.2rem"}
                  style={
                    router.locale == "en"
                      ? {
                          right: "-10px",
                        }
                      : {
                          left: "-10px",
                        }
                  }
                >
                  {showOldPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
                </Button>
              </Box>
            </Box>
            <Box my="3">
              <Box pos={"relative"}>
                <Input
                  placeholder={t("login.password")}
                  _focusVisible={"none"}
                  name="password"
                  //   value={values.password}
                  //   onChange={handleChange}
                  //   onBlur={handleBlur}
                  type={showPassword ? "text" : "password"}
                  fontSize={"1.1rem"}
                />
                <Button
                  variant={"unstyled"}
                  onClick={togglePasswordEye}
                  pos={"absolute"}
                  top={"0"}
                  fontSize={"1.2rem"}
                  style={
                    router.locale == "en"
                      ? {
                          right: "-10px",
                        }
                      : {
                          left: "-10px",
                        }
                  }
                >
                  {showPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
                </Button>
              </Box>
            </Box>
            <Box my="3">
              <Box pos={"relative"}>
                <Input
                  placeholder={t("teacher.form.confirm.password")}
                  //   value={values.confirmPassword}
                  //   onChange={handleChange}
                  //   onBlur={handleBlur}
                  _focusVisible={"none"}
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  fontSize={"1.1rem"}
                />
                <Button
                  variant={"unstyled"}
                  onClick={toggleConfirmPassword}
                  pos={"absolute"}
                  top={"0"}
                  fontSize={"1.2rem"}
                  style={
                    router.locale == "en"
                      ? {
                          right: "-10px",
                        }
                      : {
                          left: "-10px",
                        }
                  }
                >
                  {showConfirmPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
                </Button>
              </Box>
            </Box>
            <Button
              bgColor={"#822727"}
              _hover={{ bgColor: "yellow.500" }}
              type="submit"
              color={"white"}
              w="full"
              my="4"
            >
              {t("form.btn.update")}
            </Button>
          </form>
          {/* Notification */}
          <HStack justifyContent={"space-between"}>
            <Heading
              my="4"
              fontWeight={400}
              color={"blackAlpha.800"}
              fontSize={"1.4rem"}
            >
              {t("Notification")}
            </Heading>
            <Switch
            defaultChecked
              colorScheme={isChecked ? "yellow" : "white"}
              isChecked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
            />
          </HStack>
          <Box>
            <Stack flexDir={"column"}>
              <Heading
                my="4"
                fontWeight={400}
                color={"blackAlpha.800"}
                fontSize={"1.4rem"}
              >
                {t("language")}
              </Heading>
              <RadioGroup>
                <Box
                  p={"15px"}
                  width={"full"}
                  borderBottom={"1px solid"}
                  borderColor={"blackAlpha.400"}
                >
                  <Radio
                    onChange={() => {
                      router.push(router.asPath, router.asPath, {
                        locale: "en",
                      });
                    }}
                    size={"lg"}
                    value="english"
                    colorScheme="yellow"
                  >
                    English
                  </Radio>
                </Box>
                <Box
                  p={"15px"}
                  width={"full"}
                  borderBottom={"1px solid"}
                  borderColor={"blackAlpha.400"}
                >
                  <Radio
                    onChange={() => {
                      router.push(router.asPath, router.asPath, {
                        locale: "ar",
                      });
                    }}
                    size={"lg"}
                    value="arabic"
                    colorScheme="yellow"
                  >
                    Arabic
                  </Radio>
                </Box>
              </RadioGroup>
            </Stack>
          </Box>
        </Box>
      </Grid>
    </>
  );
};

export default Setting;
