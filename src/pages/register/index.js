import React, { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import {
  Box,
  Button,
  Heading,
  Text,
  Input,
} from "@chakra-ui/react";
import Link from "next/link";
import useTranslation from "@/hooks/useTranslation";
import Title from "@/components/Title";
import { CircularProgress, Alert, AlertIcon } from "@chakra-ui/react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useRouter } from "next/router";
import {  auth, db, provider, storage } from "@/firebase/firebase";
import Image from "next/image";
import Logo from "@/../../public/assets/Logo.png";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import FileUpload from "./FileUpload";
import { useForm } from "react-hook-form";
import { createFirebaseAccountAndDocument } from "src/firebase/firebaseutils";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

const Index = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState(false);
  const { t } = useTranslation();
  const [errorMessage, setErrorMessage] = useState("");
  const [messagetype, setMessagetype] = useState("error");
  const [errorAlert, setErrorAlert] = useState(false);
  const [inLogin, setInLogin] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const router = useRouter();
  const [selectedCountry, setSelectedCountry] = useState("US");

  const {
    register,
    watch,
    handleSubmit,
    control,
    reset,
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

  const handleFileUpload = async (file) => {
    try {
      const fileName = `jvnw7gh-${file.name}`;
      const storageRef = ref(storage, `users/${fileName}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      const snapshot = await uploadTask;
      const url = await getDownloadURL(snapshot.ref);
      console.log(url)
      return url
    } catch (error) {
      setAlert("File upload failed", "error", true);
      throw error;
    }
  };

  const onSubmit = async (data) => {
    if (selectedFile) {
   
      const downloadURL = await handleFileUpload(selectedFile);
        
    setInLogin(true);

    console.log({...data,photo_url: downloadURL,phone: phone ? phone : null,})
    if (data.email && data.password ) {
      createFirebaseAccountAndDocument({
        ...data,
        photo_url: downloadURL,
        phone: phone ? phone : null,
      })
        .then((alertMassage) => {

          setAlert(t(alertMassage), "success", true);
          setTimeout(() => {
            router.push("/");
            setInLogin(false);
          }, 2000);
        })
        .catch((err) => {
          setAlert(t("login.invalid"), "error", true);
          setInLogin(false);
        });
    } else {
      setInLogin(false);
      setAlert(t("login.noInputerror"), "error", true);
    }
  };
  }
  const handleGoogleSignIn = async () => {
    try {
      setInLogin(true);
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userdocRef = doc(db, "users", user.uid);
      const userdocSnap = await getDoc(userdocRef);

      if (userdocSnap.exists()) {
        // User exists in Firestore, proceed to login
        setMessagetype("success");
        setErrorMessage(t("alert.message.login"));
        setErrorAlert(true);
        setTimeout(() => {
          localStorage.setItem("userId", user.uid);
          localStorage.setItem("userdata", JSON.stringify(userdocSnap.data()));
          router.push("/");
          setInLogin(false);
        }, 2000);
      } else {
        // If the user doesn't exist, you can create a new user document
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          display_name: user.displayName,
          photo_url: user.photoURL, // Include the user's photo URL here
          phone: user.phoneNumber,
          uid: user.uid,
          // Add other fields as required
        });

        setMessagetype("success");
        setErrorMessage(t("alert.message.login"));
        setErrorAlert(true);
        setTimeout(() => {
          localStorage.setItem("userId", user.uid);
          localStorage.setItem(
            "userdata",
            JSON.stringify({
              email: user.email,
              display_name: user.displayName,
              photo_url: user.photoURL, // Include the user's photo URL here
              phone: user.phoneNumber,
              uid: user.uid,
            })
          );
          router.push("/");
          setInLogin(false);
        }, 2000);
      }
    } catch (error) {
      setInLogin(false);
      setErrorMessage(t("login.invalid"));
      setErrorAlert(true);
      console.error("Error signing in with Google:", error);
    }
  };



  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      backgroundSize={"cover"}
      backgroundImage="url('/assets/backgroundImage.png')"
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
          <Box display={"flex"} justifyContent={"center"}>
          <FileUpload
            setSelectedFile={setSelectedFile}
            selectedFile={selectedFile}
            />
            </Box>
          <Input
            borderRadius={"8px"}
            name="display_name"
            bg={"white"}
            py="4"
            marginBottom="10px"
            marginTop="10px"
            {...register("display_name", { required: "Your name is required" })}
            placeholder={t("teacher.form.name")}
            _focusVisible={"none"}
            fontSize={"1rem"}
            color={"#181818"}
            borderBottom={"1px solid"}
            borderColor={"blackAlpha.400"}
            px="3"
            aria-invalid={errors.display_name ? "true" : "false"}
          />
          {errors.display_name && (
            <p role="alert" style={{ color: "#852830" }}>
              {errors.display_name.message}
            </p>
          )}{" "}
          <Input
            borderRadius={"8px"}
            name="age"
            marginBottom="10px"
            bg={"white"}
            py="4"
            type="number"
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
          <PhoneInput
                  inputProps={{ name: "phone" }}
                  country={"at"}
                  inputStyle={{
                    paddingBlock: "22px",
                    backgroundColor: "#FFF",
                    border: "1px solid #CCC",
                    borderRadius: "8px",
                  }}
                  value={phone}
                  onChange={(phone) => setPhone(phone)}
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
          onClick={handleGoogleSignIn}
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
