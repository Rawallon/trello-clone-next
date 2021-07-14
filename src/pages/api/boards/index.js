import { ObjectId } from 'mongodb';
import { find, insert } from '../../../utils/database';

const BOARDS_COLLECTION = 'boards';

export default async function handler(req, res) {
  const requestType = req.method;
  switch (requestType) {
    case 'POST': {
      const { title, bgcolor, lists, cards, author, isPublic } = req.body;
      if (!author) {
        res.status(400).send({ error: 'Missing author' });
      }
      if (!title) {
        res.status(400).send({ error: 'Missing title' });
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
      const board = await insert(BOARDS_COLLECTION, data);
      res.send(board);
      return;
    }

    case 'GET': {
      const { userid } = req.query;
      if (!userid) {
        res.status(400).send({ error: 'Missing user id' });
        return;
      }
      const boards = await find(
        BOARDS_COLLECTION,
        { author: ObjectId(userid) },
        ['title', 'isPublic'],
      );
      res.send(boards);
      return;
    }

    default:
      res.status(400).send({ error: 'Bad request' });
      return;
  }
}
