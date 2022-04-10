import mongoose, { PaginateModel, Document } from 'mongoose';
import pagination from "mongoose-paginate-v2";

mongoose.Promise = global.Promise;

const url_connection = process.env.MONGO_CONNECTION ?? "";

interface IService extends Document {
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
  createdAt: Date;
  paginate: any;
  services: {
    name: string,
    value: string
  }[]
}

export const connect = async () => {
  const { Schema } = mongoose;
  const connect = await mongoose.connect(url_connection);

  const ClientSchema = new Schema({
    client_name: String,
    client_address: String,
    client_phone: String,
    client_cnpj_cpf: String,
    car_color: String,
    car_brand: String,
    car_model: String,
    car_license_plate: String,
    car_chassis: String,
    car_diagnosis: String,
    car_solution: String,
    car_age: String,
    total: String,
    services: [{
      name: String,
      value: String
    }]
  },
    { timestamps: true });

  ClientSchema.plugin(pagination);

  interface PostPaginateModel<T extends Document> extends PaginateModel<T> { }

  const Services: PostPaginateModel<IService> = mongoose.models.Client
    ? (mongoose.model<IService>('Client') as PostPaginateModel<IService>)
    : (mongoose.model<IService>('Client', ClientSchema) as PostPaginateModel<IService>)

  return { connect, Services }
}