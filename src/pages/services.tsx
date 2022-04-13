import {
  Box,
  Heading,
  Stack,
  Text,
  useDisclosure,
  Flex,
  Icon,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Divider,
  HStack,
  Input,
} from '@chakra-ui/react'
import axios from 'axios'
import moment from 'moment'
import type { GetServerSideProps } from 'next'
import { getSession } from "next-auth/react"
import Link from 'next/link'
import { Fragment, useState } from 'react'
import { FaCarAlt, FaMoneyCheckAlt, FaRegCalendarAlt, FaSearch, FaSearchPlus, FaUserAlt } from 'react-icons/fa'

import { generatePDF } from '../utils/generatePDF'
import type { FormData } from './new-service'

interface ServicesProps {
  clients: FormData[];
  totalDocs?: number;
  limit?: number;
  totalPages?: number;
  page?: number | null
  pagingCounter?: boolean | null
  hasPrevPage?: boolean
  hasNextPage?: boolean
  prevPage?: boolean | null
  nextPage?: boolean | null
}

interface CardProps {
  client: FormData
}

const Card = ({ client }: CardProps, { ...rest }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const date = moment(client.createdAt).format('LL')

  const handleClick = () => generatePDF(client)

  return (
    <Box
      onClick={onOpen} {...rest}
      shadow='md'
      p='3'
      borderRadius='md'
    >
      <Flex align='center'>
        <Icon as={FaUserAlt} mr='1' width='12px' />
        <Heading
          as="h3"
          fontSize="sm">
          {client.client_name}
        </Heading>
      </Flex>

      <Flex mt='1' align='center'>
        <Icon as={FaRegCalendarAlt} mr='1' width='12px' />
        <Text fontSize="x-small">
          <time dateTime={date}>
            {date}
          </time>
        </Text>
      </Flex>

      <Flex align='center' mt='1'>
        <Icon as={FaCarAlt} mr='1' width='12px' />
        <Text fontSize="smaller">
          {client.car_brand} {client.car_model}, {client.car_color}
        </Text>
      </Flex>

      <Flex align='center' mt='1'>
        <Icon as={FaMoneyCheckAlt} mr='1' width='12px' />
        <Text fontSize="x-small" fontWeight='bold'>
          R$ {client.total}
        </Text>
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay
          bg='none'
          backdropFilter='auto'
          backdropBlur='2px'
        />
        <ModalContent>
          <ModalHeader>{client.client_name}</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <Box>
              <Stack spacing="2" mt="3">
                <Flex mt='1' align='center'>
                  <Icon as={FaRegCalendarAlt} mr='1' width='12px' />
                  <Text fontSize="x-small">
                    <time dateTime={date}>
                      {date}
                    </time>
                  </Text>
                </Flex>
                <Text fontSize="small">
                  <strong>CPF: </strong>{client.client_cnpj_cpf}
                </Text>
                <Text fontSize="small">
                  <strong>Telefone: </strong><Link href={`tel:${client.client_phone}`}>{client.client_phone}</Link>
                </Text>
                <Text fontSize="small">
                  <strong>Endereço: </strong>{client.client_address}
                </Text>
              </Stack>

              <Divider my="3" />

              <Stack spacing="2" mt="3">
                <Text fontSize="small">
                  <strong>Marca: </strong>{client.car_brand}
                </Text>
                <Text fontSize="small">
                  <strong>Modelo: </strong>{client.car_model}
                </Text>
                <Text fontSize="small">
                  <strong>Cor: </strong>{client.car_color}
                </Text>
                <Text fontSize="small">
                  <strong>Ano: </strong>{client.car_age}
                </Text>
                <Text fontSize="small">
                  <strong>Placa: </strong>{client.car_license_plate}
                </Text>
                <Text fontSize="small">
                  <strong>Chassis: </strong>{client.car_chassis}
                </Text>
                <Text fontSize="small">
                  <strong>Problemas: </strong><br />
                  {client.car_diagnosis}
                </Text>
                <Text fontSize="small">
                  <strong>Soluções: </strong><br />
                  {client.car_solution}
                </Text>
                <Text fontSize="small">
                  <strong>Valores: </strong><br />
                  {client.services.map(item =>
                    <Fragment key={item.name}>
                      {item.name} - R$ {item.value} <br />
                    </Fragment>)}
                </Text>
              </Stack>

              <Divider my="3" />

              <Text fontSize="md">
                <strong>Total: </strong><br />
                R$ {client.total}
              </Text>
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='teal' onClick={handleClick}>
              Baixar PDF
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}

const Services = (props: ServicesProps) => {
  const [currentClients, setCurrentClients] = useState<ServicesProps>(props)
  const [customerSearch, setCustomerSearch] = useState('')
  const [isSearch, setIsSearch] = useState(false)

  const { clients, totalPages, page: pageApi } = currentClients;
  const page = pageApi ?? 1

  const handleChangePage = async (page: number) => {
    const { data } = await axios.get(`${window.location.origin}/api/services?page=${page}`);

    setCurrentClients(data)
  }

  const handleSearch = async (clientName: string) => {
    const { data } = await axios.get(`${window.location.origin}/api/services/${clientName}`);

    const response: FormData[] = data

    setCurrentClients({ clients: response })
    setIsSearch(true)
    setCustomerSearch('')
  }


  if (!clients || !clients.length) return <Box w="100%" mt="4" p="3">
    {isSearch &&
      <Flex justify="flex-end">
        <Button size="sm" mb="2" fontSize="x-small" onClick={() => handleChangePage(1)}>
          Limpar Busca
        </Button>
      </Flex>}
    <Flex>
      <Input
        type="text"
        placeholder='Buscar cliente por nome'
        fontSize='small'
        mb='5'
        value={customerSearch}
        onChange={(event) => setCustomerSearch(event.currentTarget.value)}
      />
      <Button ml="2" onClick={() => handleSearch(customerSearch)}>
        <Icon as={FaSearch} w="15px" />
      </Button>
    </Flex>
    <Text align="center" mt="4">Nenhum serviço disponível.</Text>
  </Box>

  return (
    <Box w="100%" mt="4" p="3">
      {isSearch &&
        <Flex justify="flex-end">
          <Button size="sm" mb="2" fontSize="x-small" onClick={() => handleChangePage(1)}>
            Limpar Busca
          </Button>
        </Flex>}

      <Flex>
        <Input
          type="text"
          placeholder='Buscar cliente por nome'
          fontSize='small'
          mb='5'
          value={customerSearch}
          onChange={(event) => setCustomerSearch(event.currentTarget.value)}
        />
        <Button ml="2" onClick={() => handleSearch(customerSearch)}>
          <Icon as={FaSearch} w="15px" />
        </Button>
      </Flex>

      <Stack spacing="4">
        {clients?.map((client, index) => (
          <Card key={`${client.client_name}-${index}`} client={client} />
        ))}
      </Stack>

      <Box my='5'>
        <Text fontSize="sm" mb="1">Página <strong>{page ?? 1}</strong> de <strong>{totalPages}</strong></Text>

        <HStack spacing='3'>
          {totalPages && Array.from({ length: totalPages }).map((item, index) => {
            if (index > 10) {
              return;
            }

            return (
              <Fragment
                key={index}
              >
                <Button
                  size="sm"
                  onClick={() => handleChangePage(index + 1)}
                  colorScheme={`${page === (index + 1) ? 'blue' : 'gray'}`}
                >
                  {index + 1}
                </Button>
                {index === 10 && <>...</>}
              </Fragment>
            )
          })}
        </HStack>
      </Box>
    </Box>
  )
}

export async function getServerSideProps(context: GetServerSideProps) {
  const { req, res } = context as any;
  const session = await getSession({ req })

  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: "/"
      }
    }
  }

  try {
    const { data } = await axios.get(`${process.env.NEXTAUTH_URL}/api/services`);
    return {
      props: data,
    }
  } catch {
    return {
      props: {},
    }
  }
}

export default Services;
