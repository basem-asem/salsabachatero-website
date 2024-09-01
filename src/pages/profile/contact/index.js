import Contact from '@/components/comman/Contact'
import { Container } from '@chakra-ui/react'
import Head from 'next/head'
import React from 'react'

const index = () => {
  return (
    <>
      <Head>
        <title>Contact</title>
      </Head>
  <Container minH={'container.md'} maxW={'container.xl'}>
<Contact/>
  </Container> 
    </>
  )
}

export default index
