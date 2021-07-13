import { connect } from '../../utils/database';

export default async function handler(req, res) {
  const { db } = await connect();
  const requestType = req.method;
  switch (requestType) {
    case 'POST': {
      const { name } = req.body;
      const data = {
        name,
      };
      const board = await db.collection('boards').insertOne(data);
      res.send(board);
      return;
    }

    case 'GET': {
      const boards = await db.collection('boards').find({}).limit(30).toArray();
      res.send(boards);

      return;
    }

    default:
      break;
  }
}
