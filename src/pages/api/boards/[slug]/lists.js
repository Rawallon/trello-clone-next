import { ObjectId } from 'mongodb';
import {
  find,
  insert,
  updateById,
  updatePushById,
} from '../../../../utils/database';

const BOARDS_COLLECTION = 'boards';

export default async function handler(req, res) {
  const requestType = req.method;
  switch (requestType) {
    case 'POST': {
      const { newList, boardId } = req.body;
      const updateReturn = updatePushById(
        BOARDS_COLLECTION,
        ObjectId(boardId),
        {
          lists: newList,
        },
      );

      if (updateReturn) {
        res.status(200).send({ success: true });
      } else {
        res.status(404).send({ success: false });
      }
    }
    case 'PATCH': {
      const { listId, insertIndex, boardId } = req.body;

      const oldBoard = await find(BOARDS_COLLECTION, {
        _id: ObjectId(boardId),
      });

      const cIndex = oldBoard[0].lists.findIndex((c) => c.id === listId);
      const newList = [...oldBoard[0].lists];
      newList.splice(insertIndex, 0, newList.splice(cIndex, 1)[0]);

      const updateReturn = updateById(
        BOARDS_COLLECTION,
        { _id: ObjectId(boardId) },
        { lists: newList },
      );

      if (updateReturn) {
        res.status(200).send({ success: true });
      } else {
        res.status(404).send({ success: false });
      }
    }
  }
}
