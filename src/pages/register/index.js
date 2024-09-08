import React, { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import {
  Box,
  Button,
  HStack,
  Heading,
  Text,
  Input,
  Select,
} from "@chakra-ui/react";
import Link from "next/link";
import useTranslation from "@/hooks/useTranslation";
import Head from "next/head";
import Title from "@/components/Title";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "src/firebase/firebase";
import { CircularProgress, Alert, AlertIcon } from "@chakra-ui/react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useRouter } from "next/router";
import { provider } from "@/firebase/firebase";
import Image from "next/image";
import Logo from "@/../../public/assets/Logo.png";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import countries from "libphonenumber-js/metadata.min.json";
import { FileUploader } from "react-drag-drop-files";
import FileUpload from "./FileUpload";
import { Controller, useForm } from "react-hook-form";
import { createFirebaseAccountAndDocument } from "src/firebase/firebaseutils";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const Index = () => {
  const fileTypes = ["JPEG", "PNG", "GIF"];
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState(false);
  const { t } = useTranslation();
  const [errorMessage, setErrorMessage] = useState("");
  const [messagetype, setMessagetype] = useState("error");
  const [errorAlert, setErrorAlert] = useState(false);
  const [inLogin, setInLogin] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();
  const [selectedCountry, setSelectedCountry] = useState("US");

  const {
    register,
    watch,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (errorAlert) {
      const timer = setTimeout(() => setErrorAlert(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [errorAlert]);

  const passwordVal = watch("password", "");

  const setAlert = (message, type, alert) => {
    setErrorMessage(message);
    setMessagetype(type);
    setErrorAlert(alert);
  };

  const onSubmit = async (data) => {
    setInLogin(true);
    if (!selectedFile) {
      setAlert("Please select a profile photo", "error", true);
      setInLogin(false);
      return;
    }

    try {
      // Handle optional phone number
      let phoneNumber = null;
      if (data.phone) {
        phoneNumber = parsePhoneNumberFromString(
          `+${data.countryCode}${data.phone}`,
          selectedCountry
        );
        if (!phoneNumber || !phoneNumber.isValid()) {
          setAlert("Invalid phone number", "error", true);
          setInLogin(false);
          return;
        }
      }

      // Upload the file to Firebase Storage
      const fileName = `${uuidv4()}-${selectedFile.name}`;
      const storageRef = ref(storage, `userFiles/${fileName}`);
      const uploadTask = uploadBytesResumable(storageRef, selectedFile);

      setUploading(true);
      const snapshot = await uploadTask;
      const downloadURL = await getDownloadURL(snapshot.ref);

      // After successful upload, create the user account with the URL
      await createFirebaseAccountAndDocument({
        ...data,
        photo_url: downloadURL,
        phone: phoneNumber ? phoneNumber.number : null, // Include phone number if available
      });

      setAlert(t("alert.message.login"), "success", true);
      setTimeout(() => {
        router.push("/home");
        setInLogin(false);
      }, 2000);
    } catch (err) {
      setAlert(t("login.invalid"), "error", true);
      setInLogin(false);
    }
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      background="linear-gradient(180deg, rgba(75, 57, 239, 1) 30%, rgba(238, 139, 96, 1) 100%)"
    >
      <Title name={"Register"} />
      <Box display="flex" justifyContent="center" alignItems="center" gap={3}>
        <Image src={Logo} width={50} height={50} objectFit="cover" />
        <Text color="white" fontSize={24} fontWeight={600}>
          Salsabachatero
        </Text>
      </Box>
      <Box
        width="auto"
        padding="20px"
        marginBottom="2.5"
        marginRight="2.5"
        marginLeft="2.5"
        backgroundColor="white"
        borderRadius="12px"
        boxShadow="0px 4px 12px rgba(0, 0, 0, 0.1)"
      >
        <Heading
          textAlign="center"
          marginBottom="10px"
          fontSize="2xl"
          fontWeight="bold"
          color="#333"
        >
          Get Started
        </Heading>
        <Text
          marginBottom="10px"
          color="#555"
          width={["auto", "70%"]}
          textAlign="center"
          marginX={"auto"}
        >
          Create an account by using the form below.
        </Text>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FileUpload
            setSelectedFile={setSelectedFile}
            selectedFile={selectedFile}
          />
          <Input
            borderRadius={"8px"}
            name="name"
            bg={"white"}
            py="4"
            marginBottom="10px"
            {...register("name", { required: t("teacher.error.name") })}
            placeholder={t("teacher.form.name")}
            _focusVisible={"none"}
            fontSize={"1rem"}
            color={"#181818"}
            borderBottom={"1px solid"}
            borderColor={"blackAlpha.400"}
            px="3"
            aria-invalid={errors.name ? "true" : "false"}
          />
          {errors.name && (
            <p role="alert" style={{ color: "#852830" }}>
              {errors.name.message}
            </p>
          )}{" "}
          <Input
            borderRadius={"8px"}
            name="age"
            marginBottom="10px"
            bg={"white"}
            py="4"
            {...register("age", { required: "Your age is required" })}
            placeholder="Your Age..."
            _focusVisible={"none"}
            fontSize={"1rem"}
            color={"#181818"}
            borderBottom={"1px solid"}
            borderColor={"blackAlpha.400"}
            px="3"
            aria-invalid={errors.name ? "true" : "false"}
          />
          {errors.name && (
            <p role="alert" style={{ color: "#852830" }}>
              {errors.name.message}
            </p>
          )}
          <Controller
            name="phone"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <PhoneInput
                country={"at"}
                {...field}
                containerClass="phoneContainer"
                buttonStyle={
                  router.locale === "ar"
                    ? {
                        paddingRight: "22px",
                      }
                    : {
                        paddingLeft: "8px",
                      }
                }
                inputClass="phoneInput"
                inputStyle={{ paddingBlock: "22px" }}
                inputProps={{
                  name: "phone",
                  required: false,
                  autoFocus: false,
                }}
                // Registering the input for validation
                {...register("phone")}
              />
            )}
          />
          {/* Error message for phone field */}
          {errors.phone && (
            <span style={{ color: "#852830" }}>{errors.phone.message}</span>
          )}
          <Input
            py="4"
            mt="2"
            placeholder={t("login.email")}
            _focusVisible={{ outline: "none", borderColor: "#4b39ef" }}
            {...register("email", {
              required: t("user.loginrequired"),
              pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            })}
            name="email"
            fontSize={"1rem"}
            type="email"
            bg={"white"}
            border="1px solid #ccc"
            borderRadius="8px"
            borderColor={"blackAlpha.400"}
            px="3"
            marginBottom="10px"
            aria-invalid={errors.email ? "true" : "false"}
          />
          {errors.email && (
            <p role="alert" style={{ color: "#852830" }}>
              {errors.email.message}
            </p>
          )}
          <Box pos={"relative"}>
            <Input
              marginBottom="10px"
              _focusVisible={"none"}
              placeholder={t("login.password")}
              type={!password ? "password" : "text"}
              fontSize={"1rem"}
              {...register("password", {
                required: t("user.passwordrequired"),
                minLength: {
                  value: 6,
                  message: t("user.passwordminimumlenght"),
                },
              })}
              py="4"
              bg={"white"}
              px="3"
              borderBottom={"1px solid"}
              borderColor={"blackAlpha.400"}
              borderRadius={"8px"}
              aria-invalid={errors.password ? "true" : "false"}
            />
            {errors.password && (
              <p role="alert" style={{ color: "#852830" }}>
                {errors.password.message}
              </p>
            )}

            {password ? (
              <AiFillEye
                onClick={() => setPassword(false)}
                style={
                  router.locale == "en"
                    ? {
                        position: "absolute",
                        top: "10px",
                        cursor: "pointer",
                        right: "10px",
                        fontSize: "1.5rem",
                        color: "#808080",
                      }
                    : {
                        position: "absolute",
                        top: "10px",
                        cursor: "pointer",
                        left: "10px",
                        fontSize: "1.5rem",
                        color: "#808080",
                      }
                }
              />
            ) : (
              <AiFillEyeInvisible
                onClick={() => setPassword(true)}
                style={
                  router.locale == "en"
                    ? {
                        position: "absolute",
                        top: "10px",
                        cursor: "pointer",
                        right: "10px",
                        fontSize: "1.5rem",
                        color: "#808080",
                      }
                    : {
                        position: "absolute",
                        top: "10px",
                        cursor: "pointer",
                        left: "10px",
                        fontSize: "1.5rem",
                        color: "#808080",
                      }
                }
              />
            )}
          </Box>
          <Box pos={"relative"}>
            <Input
              marginBottom="10px"
              _focusVisible={"none"}
              placeholder={t("teacher.form.confirm.password")}
              type={!confirmPassword ? "password" : "text"}
              fontSize={"1rem"}
              py="4"
              {...register("confirmPassword", {
                required: t("teacher.error.confirm.password"),
                validate: (value) =>
                  value === passwordVal || t("teacher.error.both.password"),
              })}
              px="3"
              bg={"white"}
              borderBottom={"1px solid"}
              borderColor={"blackAlpha.400"}
              borderRadius={"8px"}
              aria-invalid={errors.confirmPassword ? "true" : "false"}
            />
            {errors.confirmPassword && (
              <p role="alert" style={{ color: "#852830" }}>
                {errors.confirmPassword.message}
              </p>
            )}

            {confirmPassword ? (
              <AiFillEye
                onClick={() => setConfirmPassword(false)}
                style={
                  router.locale == "en"
                    ? {
                        position: "absolute",
                        top: "10px",
                        cursor: "pointer",
                        right: "10px",
                        fontSize: "1.5rem",
                        color: "#808080",
                      }
                    : {
                        position: "absolute",
                        top: "10px",
                        cursor: "pointer",
                        left: "10px",
                        fontSize: "1.5rem",
                        color: "#808080",
                      }
                }
              />
            ) : (
              <AiFillEyeInvisible
                onClick={() => setConfirmPassword(true)}
                style={
                  router.locale == "en"
                    ? {
                        position: "absolute",
                        top: "10px",
                        cursor: "pointer",
                        right: "10px",
                        fontSize: "1.5rem",
                        color: "#808080",
                      }
                    : {
                        position: "absolute",
                        top: "10px",
                        cursor: "pointer",
                        left: "10px",
                        fontSize: "1.5rem",
                        color: "#808080",
                      }
                }
              />
            )}
          </Box>
          <Button
            width="100%"
            backgroundColor="#4b39ef"
            color="white"
            paddingY="12px"
            borderRadius="8px"
            _hover={{ backgroundColor: "#6c61cd" }}
            isLoading={inLogin}
            type="submit"
            marginBottom="10px"
          >
            Create Accout
          </Button>
        </form>

        <Text textAlign="center" marginBottom="10px" color="#555">
          Or sign in with
        </Text>
        <Button
          width="100%"
          backgroundColor="white"
          border="1px solid #ccc"
          paddingY="12px"
          borderRadius="8px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          marginBottom="10px"
        >
          <FcGoogle style={{ fontSize: "2rem", marginRight: "8px" }} />
          Continue with google
        </Button>
        <Text
          textAlign="center"
          marginBottom="10px"
          color="#555"
          style={{ fontSize: "14px !important" }}
        >
          Already have account?
          <Link
            href={"/"}
            style={{ color: "#4b39ef", marginLeft: "4px", fontSize: "16px" }}
          >
            Sign in here
          </Link>
        </Text>

        {errorAlert && (
          <Alert status={messagetype} mt="4">
            <AlertIcon />
            {errorMessage}
          </Alert>
        )}
      </Box>
    </Box>
  );
};

export default Index;
