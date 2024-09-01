import Setting from '@/components/setting/Setting'
import { Container } from '@chakra-ui/react'
import Head from 'next/head'
import React from 'react'

const index = () => {
  return (
    <>
 <Head>
        <title>Settings</title>
      </Head>
  <Container minH={'container.md'} maxW={'container.xl'}>
    <Setting/>
  </Container>
    </>
  )
}

export default index
