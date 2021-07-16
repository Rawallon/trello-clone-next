import { ObjectId } from 'mongodb';
import { find, updateById, updatePushById } from '../../../../utils/database';
import { sessionReturn } from '../../../../utils/interfaces';

interface postBody {
  newList: string;
  boardId: string;
}

interface patchBody {
  listId: string;
  insertIndex: number;
  boardId: string;
}

export default async function handler(req, res) {
  const requestType = req.method;
  switch (requestType) {
    case 'POST': {
      const { newList, boardId } = req.body as postBody;
      const updateReturn = updatePushById(
        BOARDS_COLLECTION,
        new ObjectId(boardId),
        {
          lists: newList,
        },
      );

      if (updateReturn) {
        res.status(200).send({ success: true });
      } else {
        res.status(404).send({ success: false });
      }
      return;
    }
    case 'PATCH': {
      const { listId, insertIndex, boardId } = req.body as patchBody;

      const oldBoard = await find(BOARDS_COLLECTION, {
        _id: new ObjectId(boardId),
      });

      const cIndex = oldBoard[0].lists.findIndex((c) => c.id === listId);
      const newList = [...oldBoard[0].lists];
      newList.splice(insertIndex, 0, newList.splice(cIndex, 1)[0]);

      const updateReturn = updateById(
        BOARDS_COLLECTION,
        { _id: new ObjectId(boardId) },
        { lists: newList },
      );

      if (updateReturn) {
        res.status(200).send({ success: true });
      } else {
        res.status(404).send({ success: false });
      }
      return;
    }
  }
}
