import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { Board } from '../../../context/BoardContext';
import { BOARDS_COLLECTION } from '../../../utils/constants';
import { find, insert } from '../../../utils/database';
import { sessionReturn } from './../../../utils/interfaces';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const requestType = req.method;
  switch (requestType) {
    case 'POST': {
      const { title, bgcolor, lists, cards, author, isPublic } =
        req.body as Board;
      if (!author) {
        res.status(400).send({ error: 'Missing author' });
        return;
      }
      if (!title) {
        res.status(400).send({ error: 'Missing title' });
        return;
      }
      const data = {
        title: title ?? 'My board',
        bgcolor: bgcolor ?? 'rgb(210, 144, 52)',
        permissionList: [],
        lists: lists ?? [],
        cards: cards ?? [],
        author: new ObjectId(author),
        isPublic: isPublic || false,
      };
      const board = await insert(BOARDS_COLLECTION, data);
      if (board) {
        res.status(200).send({ success: board });
      } else {
        res.status(404).send({ success: false });
      }
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
        { author: new ObjectId(String(userid)) },
        ['title', 'isPublic', 'bgcolor'],
      );
      res.send(boards);
      return;
    }

    default:
      res.status(400).send({ error: 'Bad request' });
      return;
  }
}
