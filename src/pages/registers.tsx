import { Box } from '@chakra-ui/react'
import type { GetServerSideProps, NextPage } from 'next'
import { getSession } from "next-auth/react"

const Registers: NextPage = () => {
  return (
    <Box w="100%" textAlign="center" mt="30px">
      Registros
    </Box>
  )
}

export async function getServerSideProps(context: GetServerSideProps) {
  const { req } = context as any;
  const session = await getSession({ req })

  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: "/"
      }
    }
  }

  return {
    props: {}, // will be passed to the page component as props
  }
}

export default Registers;
