# Kanban Board Next

As the title suggests this is a simple kanban board, I'm designing it as a Trello-lite clone. Some functionality that are in the works are: User auth with Next-Auth, multiple boards, possibility for users to collaborate on the same board.

This project is a **Work In Progress** and everything outlined in this readme is a rough sketch that will be used as reference.

## Demo video


https://user-images.githubusercontent.com/39421317/118188625-0ec57080-b417-11eb-9d90-0f7016b36501.mp4



## User Story

### New user

1.  User logs in
1.  Sees square where board is supposed to be with text "Create Board"
1.  User clicks and a modal opens asking for new board name
1.  User clicks on the created board and is taken to /board/:id
1.  Board is loaded without any list or card
1.  User starts filling with lists/cards

## Schema

Note: This most likely will change, for an updated view checkout the file [./src/mocks/db.js](./src/mocks/db.js)

```
User:
{
username: String,
colorpicture: String,
password: String,
boards: [{ type: Schema.Types.ObjectId, ref: 'Board' }]
}

Board:
{
  title: String,
  bgcolor: String,
  cards: Array,
  lists: Array
  permisionlist: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}
```

If a Board is in a User means he can delete it
If a User is inside PermissionList means he can edit the cards
MAYBE: Store cards on it own collection, that would allow for history of changes, labels, etc.

## Endpoints

For all endpoints mocked so far go to the file [./src/mocks/handlers.js](./src/mocks/handlers.js)

    /board/id:
```
{
  Title: "My board",
  BgColor: "EFCB68",
  Lists: [
  {
    id: '1',
    title: 'Doing',
  },
  {
    id: '2',
    title: 'Done',
  },
  ],
  Cards: [
  {
    id: '1-card',
    name: 'Test Card',
    description: '# Test',
    list: '1',
  },
  ...
  ]
}
```

