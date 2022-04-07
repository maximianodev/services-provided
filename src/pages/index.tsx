import { Box, Heading, Text } from '@chakra-ui/react'
import type { NextPage } from 'next'
import { useSession, signIn, signOut } from "next-auth/react"

const Home: NextPage = () => {
  const { data: session } = useSession()

  return (
    <Box w="100%" textAlign="center" mt="30px">
      <Heading>Seja bem vindo!</Heading>
      {!session && <Text>Faça seu Login para usar o App.</Text>}
    </Box>
  )
}

export default Home
