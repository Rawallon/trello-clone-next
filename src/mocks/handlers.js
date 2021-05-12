import { rest } from 'msw';
import { db } from './db';

db.board.create();
export const handlers = [
  rest.post('/board/', (req, res, ctx) => {
    const { title, bgcolor } = req.body;
    const board = db.board.create({
      id: Number(db.board.count) + 1,
      title,
      bgcolor,
      cards: [],
      lists: [],
      permisionlist: ['1'],
    });
    return res(ctx.json(board));
  }),
  rest.patch('/board/', (req, res, ctx) => {
    const board = db.board.update({
      where: {
        id: {
          equals: req.params.id,
        },
      },
      data: {
        cards: newCards,
      },
    });
    return res(ctx.json(board.cards));
  }),
  rest.get('/board/:id', (req, res, ctx) => {
    const board = db.board.findFirst({
      where: {
        id: {
          equals: req.params.id,
        },
      },
    });
    if (!board) {
      return res(ctx.status(404));
    }
    return res(ctx.json(board));
  }),
  rest.get('http://localhost:3000/board/:id', (req, res, ctx) => {
    const board = db.board.findFirst({
      where: {
        id: {
          equals: req.params.id,
        },
      },
    });
    if (!board) {
      return res(ctx.status(404));
    }
    return res(ctx.json(board));
  }),
  rest.patch('/board/:id/card', (req, res, ctx) => {
    const oldBoard = db.board.findFirst({
      where: {
        id: {
          equals: req.params.id,
        },
      },
    });

    const { cardId, toId, insertIndex } = req.body;

    const cIndex = oldBoard.cards.findIndex((c) => c.id === cardId);
    const newCards = [...oldBoard.cards];
    const cCard = newCards.splice(cIndex, 1)[0];
    cCard.list = toId;
    newCards.splice(insertIndex, 0, cCard);

    const board = db.board.update({
      where: {
        id: {
          equals: req.params.id,
        },
      },
      data: {
        cards: newCards,
      },
    });
    return res(ctx.json(board.cards));
  }),
  rest.post('/board/:id/card', (req, res, ctx) => {
    const oldBoard = db.board.findFirst({
      where: {
        id: {
          equals: req.params.id,
        },
      },
    });
    // On real back-end validation would be done
    if (!oldBoard) {
      return res(ctx.status(404));
    }
    const board = db.board.update({
      where: {
        id: {
          equals: req.params.id,
        },
      },
      data: {
        cards: [...oldBoard.cards, req.body],
      },
    });
    return res(ctx.json(board.cards));
  }),
  rest.patch('/board/:id', (req, res, ctx) => {
    // TODO: Refactor
    const { field, value } = req.body;
    var board;
    if (field === 'background')
      board = db.board.update({
        where: {
          id: {
            equals: req.params.id,
          },
        },
        data: {
          bgcolor: value,
        },
      });
    if (field === 'title')
      board = db.board.update({
        where: {
          id: {
            equals: req.params.id,
          },
        },
        data: {
          title: value,
        },
      });

    return res(ctx.json(board));
  }),
  rest.put('/board/:id/card', (req, res, ctx) => {
    const oldBoard = db.board.findFirst({
      where: {
        id: {
          equals: req.params.id,
        },
      },
    });

    const { newData } = req.body;

    const cIndex = oldBoard.cards.findIndex((c) => c.id === newData.id);
    const newCards = [...oldBoard.cards];
    newCards.splice(cIndex, 1)[0];
    const cCard = newData;
    newCards.splice(cIndex, 0, cCard);

    const board = db.board.update({
      where: {
        id: {
          equals: req.params.id,
        },
      },
      data: {
        cards: newCards,
      },
    });
    return res(ctx.json(board.cards));
  }),
  rest.post('/board/:id/list', (req, res, ctx) => {
    const oldBoard = db.board.findFirst({
      where: {
        id: {
          equals: req.params.id,
        },
      },
    });

    const { listId, insertIndex } = req.body;

    const cIndex = oldBoard.lists.findIndex((c) => c.id === listId);
    const newList = [...oldBoard.lists];
    newList.splice(insertIndex, 0, newList.splice(cIndex, 1)[0]);

    const board = db.board.update({
      where: {
        id: {
          equals: req.params.id,
        },
      },
      data: {
        lists: newList,
      },
    });
    return res(ctx.json(board.lists));
  }),
];
