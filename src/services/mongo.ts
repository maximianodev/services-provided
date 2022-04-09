import { MongoClient } from "mongodb";

const url_connection = process.env.MONGO_CONNECTION ?? "";
const client = new MongoClient(url_connection)

export default async function connect() {
  await client.connect()

  const db = client.db('clients')

  return { db, client };
}