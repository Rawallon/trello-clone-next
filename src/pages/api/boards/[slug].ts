import { getSession } from 'next-auth/client';
import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { Board } from '../../../context/BoardContext';
import { BOARDS_COLLECTION } from '../../../utils/constants';
import { find, removeById, updateById } from '../../../utils/database';
import { sessionReturn } from '../../../utils/interfaces';
interface patchBody {
  field: string;
  value: string;
}
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = (await getSession({ req })) as unknown as sessionReturn;

  const requestType = req.method;
  switch (requestType) {
    case 'GET': {
      console.log(session);

      const { slug } = req.query;
      if (!slug) {
        res.status(400).send({ error: 'Missing boardId' });
        return;
      }
      const board: Board[] = await find(
        BOARDS_COLLECTION,
        new ObjectId(String(slug)),
      );
      if (board.length === 0) {
        res.status(404).send({ error: 'Board not found' });
        return;
      }
      res.send(board[0]);
      return;
    }

    case 'PATCH': {
      if (!session?.user?.userId) {
        res.status(403).send({ error: 'Bad author id' });
        return;
      }

      const { field, value } = req.body as patchBody;
      const { slug } = req.query;
      if (!field || !value || !slug) {
        res.status(400).send({ error: 'Bad request' });
      }

      let data;
      if (field === 'background') {
        data = {
          bgcolor: value ?? 'rgb(210, 144, 52)',
        };
      } else if (field === 'title') {
        data = {
          title: value ?? 'My board',
        };
      }

      const isBoardUpdated = await updateById(
        BOARDS_COLLECTION,
        new ObjectId(String(slug)),
        new ObjectId(String(session.user.userId)),
        data,
      );
      if (isBoardUpdated) {
        res.status(200).send({ success: true });
      } else {
        res.status(404).send({ success: false });
      }
      return;
    }

    case 'DELETE': {
      if (!session?.user?.userId) {
        res.status(403).send({ error: 'Bad author id' });
        return;
      }
      const { slug } = req.query;

      const deleteBoard = await removeById(
        BOARDS_COLLECTION,
        new ObjectId(String(slug)),
        new ObjectId(String(session.user.userId)),
      );
      if (deleteBoard) {
        res.status(200).send({ success: true });
      } else {
        res.status(404).send({ success: false });
      }
      return;
    }

    default:
      res.status(400).send({ error: 'Bad request' });
      return;
  }
}
