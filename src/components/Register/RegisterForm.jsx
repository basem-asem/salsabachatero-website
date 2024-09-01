import React, { useEffect, useState } from "react";
import { Box, Button, HStack, Input, Text, grid } from "@chakra-ui/react";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import useTranslation from "@/hooks/useTranslation";
import { useRouter } from "next/router";
import { FileUploader } from "react-drag-drop-files";
import FileUpload from "../Drag";
import { Controller, useForm } from "react-hook-form";
import { createFirebaseAccountAndDocument } from "src/firebase/firebaseutils";
import { CircularProgress } from "@chakra-ui/react";

const RegisterForm = (props) => {
  const fileTypes = ["JPEG", "PNG", "GIF"];
  const [phone, setPhone] = useState();
  const [password, setPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState(false);
  const [inLogin, setInLogin] = useState(false);
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState(null);
  const { setAlart } = props;
  const { t } = useTranslation();
  const {
    register,
    watch,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const passwordVal = watch("password", "");

  const onSubmit = (data) => {
    console.log(data)
    setInLogin(true);
    if (data.email && data.password ) {
      createFirebaseAccountAndDocument(data)
        .then(async (alertMassage) => {
          setAlart(t("alert.message.login"), "success", true);
          setTimeout(() => {
            router.push("/home");
            setInLogin(false);
          }, 2000);
        })
        .catch((err) => {
          setAlart(t("login.invalid"), "error", true);
          setInLogin(false);
        });
    } else {
      setInLogin(false);
      setAlart(t("login.noInputerror"), "error", true);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box
        height={"auto"}
        gap={"5px"}
        display={"grid"}
      >
<Text color={"#181818"} fontSize={"1rem"}>{t("teacher.form.name")}</Text>
        <Input
          borderRadius={"8px"}
          name="name"
          bg={"white"}
          py="4"
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
        )}
<Text color={"#181818"} fontSize={"1rem"}>{t("login.email")}</Text>

        <Input
          py="4"
          placeholder={t("login.email")}
          _focusVisible={"none"}
          {...register("email", { required: t("user.loginrequired") })}
          name="email"
          fontSize={"1rem"}
          type="email"
          bg={"white"}
          borderRadius={"8px"}
          borderBottom={"1px solid"}
          borderColor={"blackAlpha.400"}
          px="3"
          aria-invalid={errors.email ? "true" : "false"}
        />
        {errors.email && (
          <p role="alert" style={{ color: "#852830" }}>
            {errors.email.message}
          </p>
        )}
<Text color={"#181818"} fontSize={"1rem"}>{t("teacher.form.phone")}</Text>

<Controller
    name="phone"
    control={control}
    defaultValue=""
    render={({ field }) => (
      <PhoneInput
        country={"in"}
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
          autoFocus: false,
        }}
        // Registering the input for validation
        {...register("phone", { required: t("teacher.error.phone") })}
      />
    )}
  />
  {/* Error message for phone field */}
  {errors.phone && <span style={{color:"#852830"}}>{errors.phone.message}</span>}
  <Text color={"#181818"} fontSize={"1rem"}>{t("login.password")}</Text>

        <Box pos={"relative"}>
          <Input
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
                {errors.password && <p role="alert" style={{color:"#852830"}}>{errors.password.message}</p>}

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
  <Text color={"#181818"} fontSize={"1rem"}>{t("teacher.form.confirm.password")}</Text>

        <Box pos={"relative"}>
          <Input
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
                {errors.confirmPassword && <p role="alert" style={{color:"#852830"}}>{errors.confirmPassword.message}</p>}

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
        {/* <FileUploader
        multiple={false}
        
        handleChange={handleChange}
        name="file"
        types={fileTypes}
      /> */}
        {/* <FileUpload
          register={register}
          setSelectedFile={setSelectedFile}
          selectedFile={selectedFile}
        /> */}
      </Box>
      <HStack width={"full"} mt={8} mx="auto">
        <Button
          my="5"
          bg="#852830"
          width={"container.sm"}
          py="5"
          type="submit"
          _hover={{
            bg: "rgba(133, 40, 48, .5)",
          }}
          color={"white"}
          disabled={inLogin ? true : false}
          mx="auto"
        >
          {inLogin ? (
            <CircularProgress isIndeterminate size="20px" />
          ) : (
            t("register")
          )}
        </Button>
      </HStack>
    </form>
  );
};

export default RegisterForm;
