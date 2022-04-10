import type { AppProps } from 'next/app'
import { SessionProvider } from "next-auth/react"
import { ChakraProvider } from '@chakra-ui/react'
import { Header } from '../components/Header'
import { theme } from '../styles/theme'
import { QueryClient, QueryClientProvider } from 'react-query';
import 'moment/locale/pt-br';

const queryClient = new QueryClient()

function MyApp({
  Component,
  pageProps: { session, ...pageProps }
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <ChakraProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <Header />
          <Component {...pageProps} />
        </QueryClientProvider>
      </ChakraProvider>
    </SessionProvider>
  )
}

export default MyApp
