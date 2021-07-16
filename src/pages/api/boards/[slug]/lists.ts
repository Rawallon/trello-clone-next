import { ObjectId } from 'mongodb';
import { getSession } from 'next-auth/client';
import { BOARDS_COLLECTION } from '../../../../utils/constants';
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
  const session = (await getSession({ req })) as unknown as sessionReturn;
  const requestType = req.method;
  switch (requestType) {
    case 'POST': {
      if (!session?.user?.userId) {
        res.status(403).send({ error: 'Bad author id' });
        return;
      }

      const { newList, boardId } = req.body as postBody;
      const updateReturn = updatePushById(
        BOARDS_COLLECTION,
        new ObjectId(boardId),
        new ObjectId(String(session.user.userId)),
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
      if (!session?.user?.userId) {
        res.status(403).send({ error: 'Bad author id' });
        return;
      }

      const { listId, insertIndex, boardId } = req.body as patchBody;

      const oldBoard = await find(BOARDS_COLLECTION, {
        _id: new ObjectId(boardId),
        author: new ObjectId(String(session.user.userId)),
      });

      const cIndex = oldBoard[0].lists.findIndex((c) => c.id === listId);
      const newList = [...oldBoard[0].lists];
      newList.splice(insertIndex, 0, newList.splice(cIndex, 1)[0]);

      const updateReturn = updateById(
        BOARDS_COLLECTION,
        new ObjectId(boardId),
        new ObjectId(String(session.user.userId)),
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
