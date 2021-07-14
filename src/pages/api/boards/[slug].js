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
        return;
      }
      if (!title) {
        res.status(400).send('Missing title');
        return;
      }
      const data = {
        title,
        bgcolor: bgcolor || '#FFFFFF',
        permissionList: [],
        lists: lists || [],
        cards: cards || [],
        author: author,
        isPublic: isPublic || false,
      };
      const board = await db.collection('boards').insertOne(data);
      res.send(board);
      return;
    }

    case 'GET': {
      const { slug } = req.query;
      if (!slug) {
        res.status(400).send('Missing boardId');
        return;
      }
      const boards = await db
        .collection('boards')
        .find({ _id: ObjectId(slug) })
        .toArray();
      if (boards.length === 0) {
        res.status(404).send('Board not found');
        return;
      }
      res.send(boards);
      return;
    }

    case 'PUT': {
      const { title, bgcolor, lists, cards, isPublic } = req.body;
      const { slug } = req.query;
      const data = {
        title,
        bgcolor: bgcolor || '#FFFFFF',
        permissionList: [],
        lists: lists || [],
        cards: cards || [],
        isPublic: isPublic || false,
      };
      const update = {
        $set: data,
      };
      const board = await db
        .collection('boards')
        .updateOne({ _id: ObjectId(slug) }, update);
      res.send(board);
      return;
    }

    case 'DELETE': {
      const { slug } = req.query;

      const deleteBoard = await db
        .collection('boards')
        .deleteOne({ _id: ObjectId(slug) });
      res.send(deleteBoard);
      return;
    }

    default:
      res.status(400).send('Bad request');
      return;
  }
}
