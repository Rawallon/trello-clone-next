import { ObjectId } from 'mongodb';
import { connect } from '../../../utils/database';

export default async function handler(req, res) {
  const { db } = await connect();
  const requestType = req.method;
  switch (requestType) {
    case 'POST': {
      const { title, bgcolor, lists, cards, author, isPublic } = req.body;
      if (!author) {
        res.status(400).send('Missing author');
      }
      if (!title) {
        res.status(400).send('Missing title');
      }
      const data = {
        title,
        bgcolor: bgcolor || '#FFFFFF',
        permissionList: [],
        lists: lists || [],
        cards: cards || [],
        author: ObjectId(author),
        isPublic: isPublic || false,
      };
      const board = await db.collection('boards').insertOne(data);
      res.send(board);
      return;
    }

    case 'GET': {
      const { userid } = req.query;
      if (!userid) {
        res.status(400).send('Missing userid');
        return;
      }
      const boards = await db
        .collection('boards')
        .find({ author: ObjectId(userid) })
        .project({ title: 1, isPublic: 1 })
        .toArray();
      res.send(boards);
      return;
    }

    case 'PUT': {
      const { title, isPublic } = req.body;
      const { _id } = req.params;
      const data = {
        title,
        isPublic: isPublic || false,
      };
      const update = {
        $set: data,
      };
      const board = await db.collection('boards').updateOne({ _id }, update);
      res.send(board);
      return;
    }

    default:
      res.status(400).send('Bad request');
      return;
  }
}
