import { ObjectId } from 'mongodb';
import { find, removeById, updateById } from '../../../utils/database';

const BOARDS_COLLECTION = 'boards';

export default async function handler(req, res) {
  const requestType = req.method;
  switch (requestType) {
    case 'GET': {
      const { slug } = req.query;
      if (!slug) {
        res.status(400).send({ error: 'Missing boardId' });
        return;
      }
      const board = await find(BOARDS_COLLECTION, ObjectId(slug));
      if (board.length === 0) {
        res.status(404).send({ error: 'Board not found' });
        return;
      }
      res.send(board[0]);
      return;
    }

    case 'PATCH': {
      const { field, value } = req.body;
      const { slug } = req.query;
      if (!field || !value || !slug) {
        res.status(400).send({ error: 'Bad request' });
      }

      let data;
      if (field === 'background') {
        data = {
          bgcolor: value ?? '#FFFFFF',
        };
      } else if (field === 'title') {
        data = {
          title: value ?? 'My board',
        };
      }

      const isBoardUpdated = await updateById(
        BOARDS_COLLECTION,
        ObjectId(slug),
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
      const { slug } = req.query;

      const deleteBoard = await removeById(BOARDS_COLLECTION, ObjectId(slug));
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
