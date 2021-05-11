import { rest } from 'msw';
export const handlers = [
  rest.get('http://localhost:3000/board/1', (req, res, ctx) => {
    return res(
      ctx.json({
        title: 'My board',
        bgcolor: 'EFCB68',
        lists: [
          {
            id: '1',
            title: 'Doing',
          },
          {
            id: '2',
            title: 'Done',
          },
        ],
        cards: [
          {
            id: '1-card',
            name: 'Test Card',
            description: '# Test',
            list: '1',
          },
          {
            id: '2-card',
            name: 'Test 2',
            description: '# Tested',
            list: '1',
          },
        ],
      }),
    );
  }),
];
