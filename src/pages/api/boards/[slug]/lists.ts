import { getSession } from 'next-auth/client';
import { LISTS_COLLECTION } from '../../../../utils/constants';
import { insert, remove, update } from '../../../../utils/database';
import { idGenerator } from '../../../../utils/idGenerator';
import { sessionReturn } from '../../../../utils/interfaces';

interface postBody {
  title: string;
  position: number;
}

interface patchBody {
  listId: string;
  insertIndex?: number;
  title?: string;
  closed?: boolean;
}

export default async function handler(req, res) {
  const session = (await getSession({ req })) as unknown as sessionReturn;
  const requestType = req.method;
  switch (requestType) {
    case 'POST': {
      const { slug } = req.query;
      const { title, position } = req.body as postBody;

      if (!slug) {
        res.status(400).send({ error: 'No board id' });
        return;
      }
      if (!session?.user?.userId) {
        res.status(403).send({ error: 'Bad author id' });
        return;
      }

      const id = idGenerator();
      const data = {
        id,
        title,
        boardId: slug,
        authorId: session.user.userId,
        position,
        closed: false,
      };
      const board = await insert(LISTS_COLLECTION, data);
      if (board) {
        res.status(200).send({ success: board, id: board });
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
      const { listId, insertIndex, title, closed } = req.body as patchBody;

      let data;
      if (insertIndex !== undefined) {
        data = { position: insertIndex };
      } else if (title !== undefined) {
        data = { title };
      } else if (closed !== undefined) {
        data = { closed };
      }

      if (!listId) {
        res.status(400).send({ error: 'No list id' });
        return;
      }
      if (!data) {
        res.status(400).send({ error: 'No action to take' });
        return;
      }

      const updateReturn = update(LISTS_COLLECTION, { id: listId }, data);

      if (updateReturn) {
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
      const { listId } = req.query;

      if (!listId) {
        res.status(400).send({ error: 'No list id' });
        return;
      }
      const isRemoved = await remove(LISTS_COLLECTION, {
        id: listId,
      });
      if (isRemoved) {
        res.status(200).send({ success: true });
      } else {
        res.status(404).send({ success: false });
      }
      return;
    }
  }
}
