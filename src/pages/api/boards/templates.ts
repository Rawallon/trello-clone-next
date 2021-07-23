import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';
import {
  BOARDS_COLLECTION,
  CARDS_COLLECTION,
  LISTS_COLLECTION,
  TEMPLATES_COLLECTION,
} from '../../../utils/constants';
import { find, insert, insertMany } from '../../../utils/database';
import { idGenerator } from '../../../utils/idGenerator';
import { sessionReturn } from '../../../utils/interfaces';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const requestType = req.method;
  const session = (await getSession({ req })) as unknown as sessionReturn;
  switch (requestType) {
    // TODO: Remove this once the templates are implemented
    case 'GET': {
      const templateOne = {
        title: 'Demo template',
        templateId: 'template-0',
        lists: [
          {
            title: 'Second Col (Organize me)',
          },
          {
            title: 'First Col',
          },
          {
            title: 'Third Col',
          },
        ],
        cards: [
          {
            name: 'First Card',
            description:
              '# Hey hey\nThis is a _test_ card, not a __test__ card!',
            position: 6,
            list: 1,
          },
          {
            name: 'Second card',
            description:
              'Things to see here:\n\n- Nothing\n- Absolutely nothing',
            position: 7,
            list: 1,
          },
          {
            name: 'Drag me to third col!',
            description: '# Please\n## Please\n### Please',
            position: 8,
            list: 0,
          },
        ],
      };
      const board = await insert(TEMPLATES_COLLECTION, templateOne);
      if (board) {
        res.status(200).send({ success: board });
      } else {
        res.status(404).send({ success: false });
      }
      return;
    }

    case 'POST': {
      const { title, bgColor, templateId, isPublic } = req.body;

      if (!title) {
        res.status(400).send({ error: 'Missing title' });
        return;
      }
      if (!templateId) {
        res.status(400).send({ error: 'Missing template id' });
        return;
      }
      if (!session) {
        res.status(403).send({ error: 'Bad author id' });
        return;
      }

      const templateData = await find(TEMPLATES_COLLECTION, { templateId });
      if (!templateData) {
        res.status(404).send({ error: 'Template not found' });
        return;
      }

      // Create data of the new board
      const data = {
        title: title ?? 'My board',
        bgcolor: bgColor ?? 'rgb(210, 144, 52)',
        permissionList: [],
        author: new ObjectId(session.user.userId),
        isPublic: isPublic ?? false,
      };
      // Inserts and returns its id
      const board = await insert(BOARDS_COLLECTION, data);

      // Create the data of the new lists
      const templateLists = templateData[0].lists.map((list, index) => ({
        id: idGenerator(),
        title: list.title,
        boardId: board.toString(),
        authorId: session.user.userId,
        position: index,
        closed: false,
      }));
      // Inserts and returns its id in array format
      const insertedLists = await insertMany(LISTS_COLLECTION, templateLists);
      if (insertedLists.length === 0) {
        res.status(404).send({ success: false });
        return;
      }

      // Create the data of the cards
      const templateCards = templateData[0].cards.map((card, index) => ({
        id: idGenerator(),
        name: card.name,
        authorId: session.user.userId,
        description: card.description,
        position: card.position,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        list: String(insertedLists[card.list]),
        boardId: board.toString(),
        closed: false,
      }));
      // Inserts and returns its id in array format
      const insertedCards = await insertMany(CARDS_COLLECTION, templateCards);

      // If everything went well return boardId as success message
      if (board && insertedLists && insertedCards) {
        res.status(200).send({ success: board });
      } else {
        res.status(404).send({ success: false });
      }
      return;
    }
  }
}
