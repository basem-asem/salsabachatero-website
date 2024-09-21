import React, { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import {
  Box,
  Button,
  HStack,
  Heading,
  Text,
  Input,
  CircularProgress,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import Link from "next/link";
import useTranslation from "@/hooks/useTranslation";
import Head from "next/head";
import Title from "@/components/Title";
import { useForm } from "react-hook-form";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore"; // Ensure you import setDoc in case you need to create new users
import { auth, db, provider } from "src/firebase/firebase"; // Ensure provider is initialized in firebase.js
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useRouter } from "next/router";
import Image from "next/image";
import Logo from "@/../../public/assets/Logo.png";

export default function Home() {
  const { t } = useTranslation();
  const [inLogin, setInLogin] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [messagetype, setMessagetype] = useState("error");
  const [errorAlert, setErrorAlert] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false); // Rename this for clarity
  const router = useRouter();
  const { register, handleSubmit } = useForm();

  // Handle email/password login
  const onSubmit = (data) => {
    if (data.email && data.passwordVal) {
      setInLogin(true);
      signInWithEmailAndPassword(auth, data.email, data.passwordVal)
        .then(async (userresult) => {
          const userdocRef = doc(db, "users", userresult.user.uid);
          const userdocSnap = await getDoc(userdocRef);
          if (userdocSnap.exists()) {
            setMessagetype("success");
            setErrorMessage(t("alert.message.login"));
            setErrorAlert(true);
            setTimeout(() => {
              localStorage.setItem("userId", userdocSnap.id);
              localStorage.setItem(
                "userdata",
                JSON.stringify(userdocSnap.data())
              );
              router.push("/home");
              setInLogin(false);
            }, 2000);
          } else {
            setInLogin(false);
            setErrorMessage(t("login.invalid"));
            setErrorAlert(true);
          }
        })
        .catch((err) => {
          setInLogin(false);
          setErrorMessage(t("login.invalid"));
          setErrorAlert(true);
        });
    } else {
      setInLogin(false);
      setErrorMessage(t("login.noInputerror"));
      setErrorAlert(true);
    }
  };

  // Handle Google login
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
          router.push("/home");
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
          router.push("/home");
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

  // Handle the alert timeout
  useEffect(() => {
    if (errorAlert) {
      const timer = setTimeout(() => {
        setErrorAlert(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [errorAlert]);

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      overflow="auto"
      height="100vh"
      backgroundImage="url('/assets/backgroundImage.png')"
    >
      <Title name={"Login"} />
      <Head>
        <title>Login</title>
      </Head>
      <Box display="flex" justifyContent="center" alignItems="center" gap={3}>
        <Image src={Logo} width={50} height={50} objectFit="cover" alt="Logo" />
        <Text color="white" fontSize={24} fontWeight={600}>
          Salsabachatero
        </Text>
      </Box>
      <Box
        width="auto"
        padding="20px"
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
          Welcome Back{" "}
        </Heading>
        <Text
          marginBottom="10px"
          color="#555"
          width={["auto", "70%"]}
          textAlign="center"
          marginX="auto"
        >
          Fill out the information below in order to access your account.
        </Text>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            paddingY="12px"
            placeholder={t("login.email")}
            border="1px solid #ccc"
            borderRadius="8px"
            _focusVisible={{ outline: "none", borderColor: "#4b39ef" }}
            {...register("email", {
              required: t("user.loginrequired"),
              pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            })}
            marginBottom="10px"
          />
          <Box position="relative" marginBottom="10px">
            <Input
              paddingY="12px"
              placeholder={t("login.password")}
              type={passwordVisible ? "text" : "password"}
              border="1px solid #ccc"
              borderRadius="8px"
              _focusVisible={{ outline: "none", borderColor: "#4b39ef" }}
              {...register("passwordVal", {
                required: t("user.passwordrequired"),
                minLength: {
                  value: 6,
                  message: t("user.passwordminimumlenght"),
                },
              })}
            />
            {passwordVisible ? (
              <AiFillEye
                onClick={() => setPasswordVisible(false)}
                style={{
                  position: "absolute",
                  top: "50%",
                  right: "12px",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  fontSize: "1.5rem",
                  color: "#808080",
                }}
              />
            ) : (
              <AiFillEyeInvisible
                onClick={() => setPasswordVisible(true)}
                style={{
                  position: "absolute",
                  top: "50%",
                  right: "12px",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  fontSize: "1.5rem",
                  color: "#808080",
                }}
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
            Sign In
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
          onClick={handleGoogleSignIn}
          display="flex"
          alignItems="center"
          justifyContent="center"
          marginBottom="10px"
        >
          <FcGoogle style={{ fontSize: "1.5rem", marginRight: "8px" }} />
          Sign In with Google
        </Button>
        <Text
          textAlign="center"
          marginBottom="10px"
          color="#555"
          style={{ fontSize: "14px !important" }}
        >
          {t("don't")}
          <Link
            href={"/register"}
            style={{ color: "#4b39ef", marginLeft: "4px", fontSize: "16px" }}
          >
            Create Account
          </Link>
        </Text>
        <Button
          width="100%"
          backgroundColor="#eee"
          paddingY="12px"
          onClick={() => router.push("/forgot")}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          Forgot Password?
        </Button>

        {errorAlert && (
          <Alert status={messagetype} marginBottom="10px">
            <AlertIcon />
            {errorMessage}
          </Alert>
        )}
        <HStack justifyContent="center" fontSize="sm" spacing="1">
          <Text>{t("login.signupmessage")} </Text>
          <Link href="/signup">
            <Text color="#4b39ef">{t("signup.register")}</Text>
          </Link>
        </HStack>
      </Box>
    </Box>
  );
}
