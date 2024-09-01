import Offers from '@/components/comman/Offers'
import ProfileSidebar from '@/components/profile/ProfileSidebar'
import { Container, Grid } from '@chakra-ui/react'
import Head from 'next/head'
import React from 'react'

const index = () => {
  return (
    <>
       <Head>
        <title>Image Gallary</title>
      </Head>
  <Container minH={'container.md'} maxW={'container.xl'}>
  <Offers/>
  </Container>
    </>
  )
}

export default index
