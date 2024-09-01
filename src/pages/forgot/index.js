import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import Title from '@/components/Title';
import Banner from '@/components/comman/banner';
import useTranslation from '@/hooks/useTranslation';
import { Box, Button, HStack, Input, Text } from '@chakra-ui/react';

const ForgotPassword = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const auth = getAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage(t('password.reset.link.sent'));
      setEmail('');
      router.push('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Title name={'Forgot Password'} />
      <Banner title={t('forgot.account')}>
        <form onSubmit={handleSubmit}>
          <Box
            mx={"auto"}
            bg={"white"}
            borderRadius={"8px"}
            mt='8'
            boxShadow={"rgba(0, 0, 0, 0.16) 0px 1px 4px;"}
            width={["full", "container.sm"]}
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
              bg="#822727"
              width={"container.sm"}
              py="5"
              _hover={{ bg: "hsla(44, 100%, 50%, 0.2)" }}
              color={"white"}
              mx="auto"
              type="submit"
              isLoading={loading}
            >
              {t("continue")}
            </Button>
          </HStack>
        </form>
      </Banner>
    </>
  );
}

export default ForgotPassword;
