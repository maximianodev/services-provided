import { NextApiRequest, NextApiResponse } from 'next';
import { connect } from '../../../services/mongo';

export default async function services(req: NextApiRequest, res: NextApiResponse) {
  const { method, body, query } = req;
  const { Services } = await connect();

  if (method === 'GET') {
    // const response = await Services.aggregate([
    //   {
    //     $search: {
    //       text: {
    //         query: 'lucas',
    //         path: 'client_name'
    //       }
    //     }
    //   }
    // ]);

    try {
      const myCustomLabels: object = {
        docs: 'clients',
      };

      const options: object = {
        page: query.page ?? Number(query.page),
        limit: 5,
        customLabels: myCustomLabels,
      };

      const response = await Services.paginate({}, options)

      res.status(200).json(response);
    } catch (err) {
      res.status(500).json(err);
    }
  } else if (method === 'POST') {
    const response = await Services.create(body);

    res.status(200).json(response);
  } else {
    res.status(405).json({ error: 'GET method is allowed' });
  };
};