import { getSession } from 'next-auth/client';

import { CARDS_COLLECTION } from '../../../../utils/constants';
import { insert, update } from '../../../../utils/database';
import { idGenerator } from '../../../../utils/idGenerator';
import { sessionReturn } from './../../../../utils/interfaces';

interface postBody {
  name: string;
  listId: string;
  position: number;
}
interface putBody {
  boardId: string;
  cardId: string;
  name: string;
  description: string;
}

interface patchBody {
  cardId: string;
  toId: string;
  insertIndex: number;
  boardId: string;
}

export default async function handler(req, res) {
  const session = (await getSession({ req })) as unknown as sessionReturn;

  const requestType = req.method;
  switch (requestType) {
    case 'POST': {
      const { slug } = req.query;
      if (!slug) {
        res.status(400).send({ error: 'No board id' });
        return;
      }
      if (!session?.user?.userId) {
        res.status(403).send({ error: 'Bad author id' });
        return;
      }
      const { name, listId, position } = req.body as postBody;

      const newCard = {
        id: idGenerator(),
        name: name,
        authorId: session.user.userId,
        description: '',
        position,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        list: listId,
        boardId: slug,
        closed: false,
      };
      const card = await insert(CARDS_COLLECTION, newCard);

      if (card) {
        res.status(200).send({ success: true, id: card });
      } else {
        res.status(404).send({ success: false });
      }
      return;
    }

    case 'PATCH': {
      const { slug } = req.query;
      if (!slug) {
        res.status(400).send({ error: 'No board id' });
        return;
      }
      if (!session?.user?.userId) {
        res.status(403).send({ error: 'Bad author id' });
        return;
      }

      const { cardId, toId, insertIndex } = req.body as patchBody;

      const updateReturn = await update(
        CARDS_COLLECTION,
        { id: cardId, boardId: slug },
        {
          list: toId,
          position: insertIndex,
          updatedAt: Date.now(),
        },
      );

      if (updateReturn) {
        res.status(200).send({ success: true });
      } else {
        res.status(404).send({ success: false });
      }
      return;
    }

    case 'PUT': {
      if (!session?.user?.userId) {
        res.status(403).send({ error: 'Bad author id' });
        return;
      }

      const { boardId, cardId, name, description } = req.body as putBody;
      const isCardUpdated = await update(
        CARDS_COLLECTION,
        { id: cardId, boardId },
        { name, description, updatedAt: Date.now() },
      );
      if (isCardUpdated) {
        res.status(200).send({ success: true });
      } else {
        res.status(404).send({ success: false });
      }
      return;
    }
  }
}
