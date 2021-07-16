import { ObjectId } from 'mongodb';
import { Card } from '../../../../context/CardsContext';
import { find, updateById, updatePushById } from '../../../../utils/database';
import { sessionReturn } from './../../../../utils/interfaces';

const BOARDS_COLLECTION = 'boards';

interface postBody {
  boardId: string;
  newCard: Card;
}
interface putBody {
  boardId: string;
  newData: Card;
}

interface patchBody {
  cardId: string;
  toId: string;
  insertIndex: number;
  boardId: string;
}

export default async function handler(req, res) {
  const requestType = req.method;
  switch (requestType) {
    case 'POST': {
      const { newCard, boardId } = req.body as postBody;

      const addedCard = await updatePushById(
        BOARDS_COLLECTION,
        new ObjectId(boardId),
        {
          cards: newCard,
        },
      );

      if (addedCard) {
        res.status(200).send({ success: true });
      } else {
        res.status(404).send({ success: false });
      }
      return;
    }

    case 'PATCH': {
      const { cardId, toId, insertIndex, boardId } = req.body as patchBody;
      const oldBoard = await find(BOARDS_COLLECTION, new ObjectId(boardId));

      const cIndex = oldBoard[0].cards.findIndex((c) => c.id === cardId);
      const newCards = [...oldBoard[0].cards];
      const cCard = newCards.splice(cIndex, 1)[0];
      cCard.list = toId;
      newCards.splice(insertIndex, 0, cCard);

      const updateReturn = await updateById(
        BOARDS_COLLECTION,
        new ObjectId(boardId),
        {
          cards: newCards,
        },
      );

      if (updateReturn) {
        res.status(200).send({ success: true });
      } else {
        res.status(404).send({ success: false });
      }
      return res.status(400);
    }

    case 'PUT': {
      const { newData, boardId } = req.body as putBody;
      const oldBoard = await find(BOARDS_COLLECTION, {
        _id: new ObjectId(boardId),
        'cards.id': newData.id,
      });

      const cIndex = oldBoard[0].cards.findIndex((c) => c.id === newData.id);
      const newCards = [...oldBoard[0].cards];
      newCards.splice(cIndex, 1)[0];
      const cCard = newData;
      newCards.splice(cIndex, 0, cCard);

      const editedCard = updateById(BOARDS_COLLECTION, new ObjectId(boardId), {
        cards: newCards,
      });

      if (editedCard) {
        res.status(200).send({ success: true });
      } else {
        res.status(404).send({ success: false });
      }
      return res.status(400);
    }
  }
}
