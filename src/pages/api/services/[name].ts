import { NextApiRequest, NextApiResponse } from "next";
import { connect } from '../../../services/mongo';

export default async function service(req: NextApiRequest, res: NextApiResponse) {
  const { method, query: { name } } = req;
  const { Services } = await connect();

  if (method === 'GET') {

    try {
      const response = await Services.aggregate([
        {
          $search: {
            text: {
              query: name,
              path: 'client_name'
            }
          }
        }
      ])

      res.status(200).json(response);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(405).json({ error: 'GET method is allowed' });
  };
}