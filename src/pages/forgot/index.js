import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import Title from '@/components/Title';
import Banner from '@/components/comman/banner';
import useTranslation from '@/hooks/useTranslation';
import { Box, Button, Heading, HStack, Icon, Input, Text } from '@chakra-ui/react';
import Head from 'next/head';
import Logo from "@/../../public/assets/Logo.png";
import Image from 'next/image';
import { BsArrowLeftCircleFill } from 'react-icons/bs';
import { IoIosArrowRoundBack, IoMdArrowBack } from 'react-icons/io';

const ForgotPassword = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const auth = getAuth();
  const [errorMessage, setErrorMessage] = useState("");
  const [messagetype, setMessagetype] = useState("error");
  const [errorAlert, setErrorAlert] = useState(false);
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage(t('password.reset.link.sent'));
      setEmail('');
      router.push('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
    display="flex"
    alignItems="center"
    justifyContent="center"
    flexDirection="column"
    backgroundSize={"cover"}
    height="100vh"
    px="20px"
    backgroundImage="url('/assets/backgroundImage.png')"
  >
    <Title name={"Forgot Password"} />
    <Head>
      <title>Forgot Password</title>
    </Head>
    <Box display="flex" justifyContent="center" alignItems="center" gap={3}>
      <Image src={Logo} width={50} height={50} objectFit="cover" alt="Logo" />
      <Text color="white" fontSize={24} fontWeight={600}>
        Salsabachatero
      </Text>
    </Box>
    <Box
    pos={'relative'}
      padding="20px"
      w={"100%"}
      margin={'auto'}
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
        Forgot Password
      </Heading>
      <Text
        marginBottom="10px"
        color="#555"
        width={["auto", "70%"]}
        textAlign="center"
        marginX="auto"
      >
        Please fill out your email below in order to recive a reset password link.
      </Text>
      <Icon
        pos={"absolute"}
        m={2}
        top={0}
        left={0}
        as={IoIosArrowRoundBack}
        w={8}
        h={8}
        color="#aaa"
        cursor={"pointer"}
        onClick={() => router.push("/")}
      />
      <form onSubmit={handleSubmit}>
          <Box
            mx={"auto"}
            bg={"white"}
            borderRadius={"8px"}
            mt='8'
            boxShadow={"rgba(0, 0, 0, 0.16) 0px 1px 4px;"}
            width={"full"}
            height={"auto"}
          >
            <Input
              py="7"
              placeholder={t("login.email")}
              border={"none"}
              _focusVisible={"none"}
              fontSize={"1.1rem"}
              borderRadius={'6px'}
              borderBottom={"2px solid"}
              borderColor={"blackAlpha.400"}
              px="3"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Box>

          {message && (
            <Text color="green.500" mt="4" textAlign="center">
              {message}
            </Text>
          )}
          {error && (
            <Text color="red.500" mt="4" textAlign="center">
              {error}
            </Text>
          )}

          <HStack width={"full"} mt='10' mx="auto">
            <Button
              my="5"
              backgroundColor="#4b39ef"
              width={"container.sm"}
              py="5"
              _hover={{ backgroundColor: "#6c61cd" }}
              color={"white"}
              mx="auto"
              type="submit"
              isLoading={loading}
            >
              Send reset Link
            </Button>
          </HStack>
        </form>
      
      {errorAlert && (
        <Alert status={messagetype} marginBottom="10px">
          <AlertIcon />
          {errorMessage}
        </Alert>
      )}
      
    </Box>
  </Box>
);
}

export default ForgotPassword;
