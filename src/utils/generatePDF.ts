import jsPDF from "jspdf";
import { FormData } from "../pages/new-service";
import { formattedDate } from "./formattedDate";

export function generatePDF(data: FormData) {
  const doc = new jsPDF()

  doc.setFontSize(30);
  doc.text("Mecânica", 20, 20);

  doc.setFontSize(15);
  doc.text("Cliente", 20, 40);

  doc.setFontSize(12);
  doc.text(`Nome: ${data.client_name}`, 20, 50);

  doc.setFontSize(12);
  doc.text(`CNPJ/CPF: ${data.client_cnpj_cpf}`, 20, 55);

  doc.setFontSize(12);
  doc.text(`Telefone: ${data.client_phone}`, 20, 60);

  doc.setFontSize(12);
  doc.text(`Endereço: ${data.client_address}`, 20, 65);

  doc.setFontSize(15);
  doc.text("Carro", 20, 75);

  doc.setFontSize(12);
  doc.text(`Cor: ${data.car_color}`, 20, 85);

  doc.setFontSize(12);
  doc.text(`Marca: ${data.car_brand}`, 20, 90);

  doc.setFontSize(12);
  doc.text(`Modelo: ${data.car_model}`, 20, 95);

  doc.setFontSize(12);
  doc.text(`Ano: ${data.car_age}`, 20, 100);

  doc.setFontSize(12);
  doc.text(`Placa: ${data.car_license_plate}`, 20, 105);

  doc.setFontSize(12);
  doc.text(`Chassis: ${data.car_chassis}`, 20, 110);

  doc.setFontSize(15);
  doc.text("Diagnóstico", 20, 120);

  doc.setFontSize(10);
  doc.text(`${data.car_diagnosis}`, 20, 125);

  doc.setFontSize(15);
  doc.text(`Soluções`, 20, 155);

  doc.setFontSize(10);
  doc.text(`${data.car_solution}`, 20, 162);

  doc.setFontSize(15);
  doc.text(`Valores`, 20, 190);

  doc.setFontSize(10);

  let serviceValues = data.services.reduce((acc, item) => {
    acc += `\n ${item.name} R$ ${item.value}`

    return acc
  }, '')
  doc.text(serviceValues, 20, 195)

  doc.setFontSize(15);
  doc.text(`Total: R$ ${data.total}`, 150, 250);

  doc.setFontSize(10);
  doc.text(`Data: ${formattedDate()}`, 150, 260);

  const dateFile = new Date().getDate() + '_' + (new Date().getMonth() + 1) + '_' + new Date().getFullYear()

  return doc.save(`Servico_${data.client_name.replaceAll(" ", "_")}_${dateFile}.pdf`);
}
