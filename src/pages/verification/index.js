import Title from '@/components/Title'
import Banner from '@/components/comman/banner'
import useTranslation from '@/hooks/useTranslation'
import { Box, Button, HStack, Input } from '@chakra-ui/react'
import Link from 'next/link'
import React from 'react'

const index = () => {
    const {t} = useTranslation()
  return (
    <>
      <Title name={'Email verification'}/>
      <Banner title={t('verify')}>
      <form>
          <Box
            mx={"auto"}
            bg={"white"}
            mt='6 '

            borderRadius={"8px"}
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
              borderRadius={0}
              borderBottom={"2px solid"}
              borderColor={"blackAlpha.400"}
              px="3"
            />
          
          </Box>
       

          <HStack width={"full"} mx="auto">
            <Button
              my="5"
              bg="#FFBB00"
              width={"container.sm"}
              py="5"
              _hover={{
                bg: "hsla(44, 100%, 50%, 0.2)",
              }}
              color={"white"}
              mx="auto"
            >
              {t("continue")}
            </Button>
          </HStack>
        </form>
      </Banner>
    </>
  )
}

export default index
