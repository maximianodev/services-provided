import React from 'react'
import { Avatar, Button, Flex, Icon, Menu, Text } from '@chakra-ui/react'
import { useSession, signIn, signOut } from "next-auth/react"
import { FaGoogle } from "react-icons/fa";

import { CustomMenu } from './CustomMenu'

export const Header = () => {
  const { data: session } = useSession()

  return (
    <Flex
      w="100%"
      bg="blackAlpha.900"
      align="center"
      px="4"
      py="4"
      position="sticky"
      top="0"
      zIndex="10"
    >
      <CustomMenu />

      {session ?
        <Flex justify="space-between" align="center" w="100%">
          <Flex>
            <Avatar name={session.user?.name ?? ''} src={session.user?.image ?? ''} />

            <Text
              color="#fff"
              fontSize="small"
              ml="2"
            >
              Bem vindo <br />
              <strong>{session.user?.name}</strong>
            </Text>
          </Flex>

          <Button colorScheme="red" size="sm" onClick={() => signOut()} ml="2">
            Logout
          </Button>
        </Flex>
        :
        <Button size="sm" onClick={() => signIn('google', { callbackUrl: 'http://localhost:3000/registros' })}>
          <Icon as={FaGoogle} mr="2" color="#1c1c1c" /> Login
        </Button>}
    </Flex >
  )
}
