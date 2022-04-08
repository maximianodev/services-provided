import React from 'react'
import { Icon, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react'
import { useSession } from "next-auth/react"
import { FiMenu } from "react-icons/fi";
import Link from 'next/link';

export const CustomMenu = () => {
  const { data: session } = useSession()

  return (
    <Menu isLazy>
      <MenuButton mr="4">
        <Icon
          as={FiMenu}
          color="#fff"
          w="25px"
          h="25px"
          d="flex"
          alignItems="center"
        />
      </MenuButton>
      <MenuList>
        {session ? <>
          <MenuItem>
            <Link href="/">
              <a>
                Inicio
              </a>
            </Link>
          </MenuItem>
          <MenuItem>
            <Link href="/services">
              <a>
                Serviços
              </a>
            </Link>
          </MenuItem>
          <MenuItem>
            <Link href="/new-service">
              <a>
                Novo Serviço
              </a>
            </Link>
          </MenuItem>
        </> : <>
          <MenuItem>
            <Link href="/">
              <a>
                Login
              </a>
            </Link>
          </MenuItem>
        </>}
      </MenuList>
    </Menu>
  )
}
