const formScheme = {
  items: [
    {
      title: "Cliente",
      fields: [
        { name: "client_name", type: "text", label: "Nome" },
        { name: "client_address", type: "text", label: "Endereço" },
        { name: "client_phone", type: "text", label: "Telefone" },
        { name: "client_cnpj_cpf", type: "text", label: "CNPJ ou CPF" },
      ]
    },
    {
      title: "Carro",
      fields: [
        { name: "car_color", type: "text", label: "Cor" },
        { name: "car_brand", type: "text", label: "Marca" },
        { name: "car_model", type: "text", label: "Modelo" },
        { name: "car_age", type: "text", label: "Ano" },
        { name: "car_license_plate", type: "text", label: "Placa" },
        { name: "car_chassis", type: "text", label: "Chassis" },
      ]
    },
    {
      title: "Diagnóstico / Solução",
      fields: [
        { name: "car_diagnosis", type: "textarea", label: "Diagnósticos" },
        { name: "car_solution", type: "textarea", label: "Solução" }
      ]
    }
  ]
}

export { formScheme }