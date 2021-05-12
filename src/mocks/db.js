import { factory, primaryKey } from '@mswjs/data';

export const db = factory({
  board: {
    id: primaryKey(() => '1'),
    title: () => 'My board',
    bgcolor: () => 'rgb(210, 144, 52)',
    lists: () => [
      {
        id: '1',
        title: 'Doing',
      },
      {
        id: '2',
        title: 'Done',
      },
    ],
    cards: () => [
      {
        id: '1-card',
        name: 'Test Card 1',
        description: '# Test',
        list: '1',
      },
      {
        id: '2-card',
        name: 'Test Card 2',
        description: '# Tested',
        list: '1',
      },
    ],
  },
});
