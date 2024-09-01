import React, { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { Box, Button, HStack, Heading, Text, Input } from "@chakra-ui/react";
import Link from "next/link";
import useTranslation from "@/hooks/useTranslation";
import Head from "next/head";
import Title from "@/components/Title";
import { useForm } from "react-hook-form";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "src/firebase/firebase";
import { CircularProgress, Alert, AlertIcon } from "@chakra-ui/react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useRouter } from "next/router";
import { provider } from "@/firebase/firebase";
import Image from "next/image";
import Logo from "@/../../public/assets/Logo.png";

export default function Home() {
  const { t } = useTranslation();
  const [inLogin, setInLogin] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [messagetype, setMessagetype] = useState("error");
  const [errorAlert, setErrorAlert] = useState(false);
  const [password, setPassword] = useState(false);
  const router = useRouter();
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    if (data.email && data.passwordVal) {
      setInLogin(true);
      signInWithEmailAndPassword(auth, data.email, data.passwordVal)
        .then(async (userresult) => {
          const userdocRef = doc(db, "users", userresult.user.uid);
          const userdocSnap = await getDoc(userdocRef);
          if (userdocSnap.exists()) {
            const { Role } = userdocSnap.data();
            if (Role === "User") {
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

  useEffect(() => {
    if (errorAlert) {
      const timer = setTimeout(() => {
        setErrorAlert(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [errorAlert]);

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userdocRef = doc(db, "users", user.uid);
      const userdocSnap = await getDoc(userdocRef);

      if (userdocSnap.exists()) {
        const { Role } = userdocSnap.data();
        if (Role === "User") {
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
      } else {
        setInLogin(false);
        setErrorMessage(t("login.invalid"));
        setErrorAlert(true);
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
      overflow={"auto"}
      height={"100vh"}
      background="linear-gradient(180deg, rgba(75, 57, 239, 1) 30%, rgba(238, 139, 96, 1) 100%)"
    >
      <Title name={"Login"} />
      <Head>
        <title>Login</title>
      </Head>
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
          Welcome Back{" "}
        </Heading>
          <Text marginBottom="10px" color="#555" width={["auto","70%"]} textAlign="center" marginX={"auto"}>
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
              type={password ? "text" : "password"}
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
            {password ? (
              <AiFillEye
                onClick={() => setPassword(false)}
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
                onClick={() => setPassword(true)}
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
          <FcGoogle style={{ fontSize: "2rem", marginRight: "8px" }} />
          Continue with google
        </Button>
        <Text textAlign="center" marginBottom="10px" color="#555" style={{fontSize: "14px !important"}}>
          {t("don't")}
          <Link
            href={"/register"}
            style={{ color: "#4b39ef", marginLeft: "4px" , fontSize: "16px"}}
          >
            Create Account
          </Link>
        </Text>
        <Button
          width="100%"
          backgroundColor="#eee"
          paddingY="12px"
          onClick={()=> router.push("/forgot")}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          Forgot Password?
        </Button>
       
      </Box>
      {errorAlert && (
        <Alert
          status={messagetype}
          position="fixed"
          top="20px"
          right="20px"
          width="300px"
          borderRadius="8px"
          zIndex="1000"
        >
          <AlertIcon />
          <Text>{errorMessage}</Text>
        </Alert>
      )}
    </Box>
  );
}
