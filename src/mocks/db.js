import { factory, manyOf, oneOf, primaryKey } from '@mswjs/data';

export const db = factory({
  user: {
    id: primaryKey(() => '1'),
    username: () => 'Rawallon Cardoso',
    password: () => '123123',
    boards: manyOf('board'),
  },
  board: {
    id: primaryKey(() => '1'),
    title: () => 'My board',
    bgcolor: () => 'rgb(210, 144, 52)',
    permissionList: manyOf('user'),
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
