import type { AppProps } from 'next/app'
import { SessionProvider } from "next-auth/react"
import { ChakraProvider } from '@chakra-ui/react'
import { Header } from '../components/Header'
import { theme } from '../styles/theme'

function MyApp({
  Component,
  pageProps: { session, ...pageProps }
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <ChakraProvider theme={theme}>
        <Header />
        <Component {...pageProps} />
      </ChakraProvider>
    </SessionProvider>
  )
}

export default MyApp
