import {
  Box,
  Button,
  FormLabel,
  Heading,
  Input,
  Spinner,
  Stack,
  Stat,
  StatLabel,
  StatNumber,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Textarea,
  Th,
  Thead,
  Tr,
  useToast
} from '@chakra-ui/react'
import axios from 'axios';
import type { GetServerSideProps, NextPage } from 'next'
import { getSession } from "next-auth/react"
import { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from 'react-query';
import { formScheme } from '../utils/formScheme';
import { generatePDF } from '../utils/generatePDF';

interface ServiceProps {
  name: string;
  value: string;
}

export interface FormData {
  client_name: string;
  client_address: string;
  client_phone: string;
  client_cnpj_cpf: string;
  car_color: string;
  car_brand: string;
  car_model: string;
  car_license_plate: string;
  car_chassis: string;
  car_diagnosis: string;
  car_solution: string;
  car_age: string;
  total: string;
  services: ServiceProps[];
  createdAt: string;
}

const NewService: NextPage = () => {
  const [serviceName, setServiceName] = useState<string>('')
  const [serviceValue, setServiceValue] = useState<string>('')
  const [services, setServices] = useState<ServiceProps[]>([])

  const toast = useToast()

  const { register, handleSubmit, formState: { errors }, setValue, reset, watch } = useForm();

  const queryClient = useQueryClient();

  const registerFormData = async (data: any) => {
    const { data: response } = await axios.post('/api/services', data);
    return response.data;
  };

  const { mutate, isLoading } = useMutation(registerFormData, {
    onSuccess: () => {
      toast({
        title: 'Registro criado com sucesso.',
        description: 'Seu PDF foi baixado!',
        status: 'success',
        duration: 9000,
        isClosable: true,
      })
    },
    onError: () => {
      toast({
        title: 'Erro ao criar o registro',
        description: 'Tente denovo, caso persista contate o suporte',
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries('create');
    }
  });

  const servicesTotal = services.length ?
    services?.reduce((acc: number, item: ServiceProps) => {
      let value = Number(item.value)
      acc = value + acc

      return acc
    }, 0).toFixed(2) : 0

  const handleSaveService = (ev: React.SyntheticEvent) => {
    ev.preventDefault()

    if (serviceName === '' || serviceValue === '') {
      return;
    }

    const newService = { name: serviceName, value: serviceValue }

    setServiceName('')
    setServiceValue('')

    if (services.length) {
      setServices([...services, newService])
      // react-hook-form
      setValue('services', [...services, newService])
    } else {
      setServices([newService])
      // react-hook-form
      setValue('services', [newService])
    }
  }

  const handleDeleteService = (name: string) => {
    const servicesFiltered = services.filter(service => service.name !== name)

    setServices(servicesFiltered)
    // react-hook-form
    setValue('services', servicesFiltered)
  }

  const onSubmit = (data: any) => {
    mutate(data)
    generatePDF(data)
    reset()
    setServices([])
  }

  useEffect(() => {
    setValue('total', servicesTotal)
  }, [servicesTotal, services])

  return (
    <Box my="15px">
      <Box p="3">
        <Heading fontSize="x-large">Novo Registro</Heading>

        <Box
          borderRadius="md"
          shadow="lg"
          p="3"
          mt="15px"
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing="6">
              {formScheme.items.map(item => (
                <Box key={item.title}>
                  <Text mb="4" fontSize="large" fontWeight="bold">{item.title}</Text>
                  <Stack spacing="3">
                    {item.fields.map(item => (
                      <Box key={item.label}>
                        <FormLabel
                          htmlFor={item.name}
                          fontWeight="normal"
                          fontSize="sm"
                        >
                          {item.label}
                        </FormLabel>

                        {item.type === "textarea" &&
                          <Textarea
                            fontSize="12px"
                            isInvalid={errors[item.name] ? true : false}
                            {...register(`${item.name}`, { required: true })}
                          />}

                        {item.type === "text" &&
                          <Input
                            fontSize="12px"
                            isInvalid={errors[item.name] ? true : false}
                            type={item.type} {...register(`${item.name}`, { required: true })}
                          />}

                        {errors[item.name] &&
                          <Text
                            color="red"
                            fontSize="sm"
                            mt="2">
                            Campo obrigatório!
                          </Text>}
                      </Box>))}
                  </Stack>
                </Box>))}

              <Box>
                <Heading fontSize="lg" mb="3">Valores</Heading>

                <Stack spacing="3" w="100%" my="3">
                  <div>
                    <FormLabel
                      htmlFor="service_name"
                      fontWeight="normal"
                      fontSize="sm"
                    >
                      Nome do Serviço
                    </FormLabel>
                    <Input
                      fontSize="12px"
                      type="text"
                      name="service_name"
                      onChange={(ev) => setServiceName(ev.currentTarget.value)}
                      value={serviceName}
                    />
                  </div>

                  <div>
                    <FormLabel
                      htmlFor="service_value"
                      fontWeight="normal"
                      fontSize="sm"
                    >
                      Valor do Serviço
                    </FormLabel>
                    <Input
                      fontSize="12px"
                      type="number"
                      name="service_value"
                      onChange={(ev) => setServiceValue(ev.currentTarget.value)}
                      value={serviceValue}
                    />
                  </div>
                  <Button
                    size="sm"
                    w="150px"
                    alignSelf="self-end"
                    colorScheme="teal"
                    onClick={handleSaveService}
                  >
                    Registrar valor
                  </Button>
                </Stack>
                {services &&
                  <>
                    <Text mt="6" mb="3" fontSize="sm">Resumo</Text>
                    <TableContainer>
                      <Table size="sm" variant='striped' colorScheme="teal">
                        <Thead>
                          <Tr>
                            <Th>Nome</Th>
                            <Th isNumeric>Valor</Th>
                          </Tr>
                        </Thead>

                        <Tbody>
                          {services.map((item: ServiceProps, key) =>
                            <Tr key={`${item.name}-${key}`}>
                              <Td>{item.name}</Td>
                              <Td isNumeric>R$ {Number(item.value).toFixed(2)}</Td>
                              <Td w="1">
                                <Button
                                  size="sm"
                                  onClick={() => handleDeleteService(item.name)}>X</Button>
                              </Td>
                            </Tr>)}
                        </Tbody>
                      </Table>
                    </TableContainer>

                    <Stat d="flex" flexDirection="column" alignItems="flex-end" mt="4" pr="4">
                      <StatLabel>Total</StatLabel>
                      <StatNumber>R$ {servicesTotal}</StatNumber>
                    </Stat>
                  </>}

              </Box>
              {isLoading ? <Spinner /> :
                <Button
                  type="submit"
                  colorScheme="teal"
                >
                  Salvar
                </Button>}
            </Stack>
          </form>
        </Box>
      </Box>
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
    props: {},
  }
}

export default NewService;
