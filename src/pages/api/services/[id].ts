import { NextApiRequest, NextApiResponse } from "next";
import connect from "../../../services/mongo";

export default async function service(req: NextApiRequest, res: NextApiResponse) {
  const { method, query: { id } } = req;

  const { db } = await connect();

  if (method === 'GET') {
    const response = await db.collection('services_provided').find({ _id: id }).toArray();
    console.log('🚀 ~ file: [id].ts ~ line 11 ~ service ~ response', response)

    res.status(200).json(response);
  } else {
    res.status(405).json({ error: 'GET method is allowed' });
  };
}