import Address from '@/components/comman/Address'
import { Container } from '@chakra-ui/react'
import Head from 'next/head'
import React from 'react'

const index = () => {
  return (
    <>
       <Head>
        <title>Manage Address</title>
      </Head>
  <Container minH={'container.md'} maxW={'container.xl'}>
    <Address/>
  </Container>
    </>
  )
}

export default index
