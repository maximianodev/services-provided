import { NextApiRequest, NextApiResponse } from 'next';
import connect from '../../../services/mongo';

export default async function services(req: NextApiRequest, res: NextApiResponse) {
  const { method, body } = req;

  const { db } = await connect();

  if (method === 'GET') {
    const response = await db.collection('services_provided').find().toArray();

    res.status(200).json(response);
  } else if (method === 'POST') {
    const response = await db.collection('services_provided').insertOne(body);

    res.status(201).json(response);
  } else {
    res.status(405).json({ error: 'GET method is allowed' });
  };
};