import { GetServerSideProps } from 'next';
import { getSession, useSession } from 'next-auth/client';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import {
  DragDropContext,
  Draggable,
  Droppable,
  resetServerContext,
} from 'react-beautiful-dnd';
import { io } from 'socket.io-client';
import AddList from '../../components/BoardPage/AddList';
import Card from '../../components/BoardPage/Card';
import Column from '../../components/BoardPage/Column';
import ColumnHeader from '../../components/BoardPage/ColumnHeader';
import ModalPortal from '../../components/BoardPage/ModalPortal';
import { Board, useBoard } from '../../context/BoardContext';
import { useCards } from '../../context/CardsContext';
import { useList } from '../../context/ListsContext';
import { useModal } from '../../context/ModalContext';
import styles from '../../styles/Board.module.css';
import ApiCall from '../../utils/API';
import { sessionReturn } from '../../utils/interfaces';

let socket;
export default function BoardSlug({
  bId,
  bTitle,
  cards,
  lists,
  bColor,
  isPublic,
  isAuthorized,
  permissionList,
}) {
  resetServerContext();

  const [session, loading] = useSession();
  const router = useRouter();

  const {
    putBoardData,
    changeBoard,
    title,
    bgColor,
    bgOptions,
    isPublic: isPublicContext,
    deleteBoard,
  } = useBoard();
  const {
    createList,
    putLists,
    currentList,
    moveList,
    getList,
    updateListTitle,
    archiveList,
  } = useList();
  const {
    createCard,
    putCards,
    currentCards,
    moveCard,
    getCard,
    updateCardData,
  } = useCards();
  const { showModal } = useModal();

  useEffect(() => {
    if (bTitle !== '' && bTitle !== undefined) {
      putBoardData(bTitle, bColor, isPublic);
      putCards(cards);
      putLists(lists);
    }
  }, [cards, lists]);

  useEffect(() => {
    if (
      socket === undefined &&
      typeof window !== 'undefined' &&
      currentList.length > 0
    ) {
      fetch('/api/socketio').finally(() => {
        socket = io();
        socket.on('connect', () => {
          socket.emit('joinRoom', bId);
          console.log('[WS] Connect => A connection with has been established');
        });
        socket.on('disconnect', () =>
          console.log('[WS] Disconnect => A connection has been terminated'),
        );

        socket.on('changeBoard', (data) => {
          changeBoard(bId, data.type, data.value, true);
        });

        socket.on('moveList', (data) => {
          moveList(bId, String(data.listId), Number(data.insertIndex), true);
        });
        socket.on('createList', (data) => {
          createList(bId, data.title, true, undefined, data.id);
        });
        socket.on('archiveList', (data) => {
          archiveList(bId, String(data.listId), Boolean(data.value), true);
        });
        socket.on('updateListTitle', (data) => {
          updateListTitle(
            bId,
            String(data.listId),
            String(data.listTitle),
            true,
          );
        });
        socket.on('createCard', (data) => {
          createCard(bId, data.name, data.list, undefined, true, data.id);
        });
        socket.on('updateCardData', (data) => {
          updateCardData(bId, data.cardId, data.title, data.description, true);
        });
        // socket.on('archiveCard', (data) => {
        //   archiveCard(bId, String(data.cardId), Boolean(data.value), true);
        // });
        socket.on('moveCard', (data) => {
          moveCard(
            bId,
            String(data.cardId),
            String(data.toId),
            Number(data.insertIndex),
            true,
          );
        });
      });
    }
  }, [currentList]);

  function updateCardHandler(
    cardId: string,
    title: string,
    description: string,
  ) {
    updateCardData(bId, cardId, title, description);
    socket.emit('updateCardData', {
      id: bId,
      data: {
        cardId,
        title,
        description,
      },
    });
  }
  function createCardHandler(name: string, list: string) {
    if (!String(name) || !String(list)) return;
    createCard(bId, name, list, socket);
  }
  function dragEndHandle(event: any) {
    // If theres no destination or the destination is the same as the source returns
    if (
      !event.destination ||
      (event.source.droppableId === event.destination.droppableId &&
        event.source.index === event.destination.index)
    ) {
      return;
    }

    if (event.type === 'CARD') {
      moveCard(
        bId,
        event.draggableId,
        event.destination.droppableId,
        event.destination.index,
      );
      socket.emit('moveCard', {
        id: bId,
        data: {
          cardId: event.draggableId,
          toId: event.destination.droppableId,
          insertIndex: event.destination.index,
        },
      });
    }
    if (event.type === 'COLUMN') {
      moveList(bId, event.draggableId, event.destination.index);
      socket.emit('moveList', {
        id: bId,
        data: {
          listId: event.draggableId,
          insertIndex: event.destination.index,
        },
      });
    }
  }

  function createListHandle(listData: string) {
    createList(bId, listData, false, socket);
  }
  function permissionListHandler(userIds: string) {
    const trimUser = userIds.split(',').map((userId) => userId.trim());
    changeBoard(bId, 'permissionList', trimUser);
  }
  function updateListTitleHandler(listId: string, listTitle: string) {
    updateListTitle(bId, listId, listTitle);
    socket.emit('updateListTitle', {
      id: bId,
      data: {
        listId,
        listTitle,
      },
    });
  }
  function archiveListHandler(listId: string, value: boolean) {
    archiveList(bId, listId, value);
    socket.emit('archiveList', {
      id: bId,
      data: {
        listId,
        value,
      },
    });
  }
  // function archiveCardHandler(listId: string, value: boolean) {
  //   archiveCard(bId, listId, value);
  //   socket.emit('archiveCard', {
  //     id: bId,
  //     data: {
  //       listId,
  //       value,
  //     },
  //   });
  // }

  async function deleteBoardHandler() {
    const confirm = window.confirm(
      'Are you sure you want to delete this board?',
    );
    if (confirm) {
      await deleteBoard(bId);
      router.push('/boards');
      socket.emit('deletedBoard', {
        id: bId,
      });
    }
  }

  function changeBoardHandler(type: string, value: string) {
    changeBoard(bId, type, value);
    socket.emit('changeBoard', {
      id: bId,
      data: {
        type,
        value,
      },
    });
  }

  if (typeof window !== 'undefined' && loading) return null;
  if (typeof window !== 'undefined' && !isPublic && !isAuthorized) {
    router.push('/');
    return null;
  }
  return (
    <DragDropContext onDragEnd={dragEndHandle}>
      <Head>
        <title>{title} - Nello</title>
      </Head>
      <div
        className={styles.backgroundHolder}
        style={{ backgroundColor: bgColor }}
      />
      <ModalPortal
        getList={getList}
        getCard={getCard}
        updateCardData={updateCardHandler}
      />
      <ColumnHeader
        changeBgHandler={(value) => changeBoard(bId, 'background', value)}
        changeTitleHandler={(value) => changeBoard(bId, 'title', value)}
        title={bTitle}
        bgOptions={bgOptions}
        isAuthorized={isAuthorized}
        isPublic={isPublicContext}
        setIsPublicHandler={(value) =>
          changeBoard(bId, 'isPublic', Boolean(value))
        }
        permissionList={permissionList ? permissionList.join(', ') : ''}
        permissionListHandler={permissionListHandler}
        deleteBoardHandler={deleteBoardHandler}
      />
          changeBgHandler={(value) => changeBoardHandler('background', value)}
          changeTitleHandler={(value) => changeBoardHandler('title', value)}
      <Droppable
        direction="horizontal"
        type="COLUMN"
        droppableId="board"
        isDropDisabled={!isAuthorized}>
        {(provided, snapshot) => (
          <div
            className={styles.BoardWrapper}
            ref={provided.innerRef}
            {...provided.droppableProps}>
            {currentList.map((column, index) => (
              <Column
                updateListTitle={updateListTitleHandler}
                archiveListHandler={archiveListHandler}
                createCard={createCardHandler}
                title={column.title}
                id={column.id}
                key={column.id}
                index={index}
                isDropDisabled={!isAuthorized}>
                {currentCards
                  .filter((item) => item.list === String(column.id))
                  .map((item, index) => (
                    <Draggable
                      isDragDisabled={!isAuthorized}
                      key={item.id}
                      draggableId={item.id}
                      index={index}>
                      {(provided, snapshot) => (
                        <div
                          id={item.id}
                          onClick={() => showModal(item.id)}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          draggable={true}>
                          <Card id={item.id}>{item.name}</Card>
                          {provided.placeholder}
                        </div>
                      )}
                    </Draggable>
                  ))}
              </Column>
            ))}
            {provided.placeholder}
            {isAuthorized && <AddList createList={createListHandle} />}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = (await getSession(ctx)) as unknown as sessionReturn;
  const { slug } = ctx.params;

  const data: Board = await ApiCall(`http://localhost:3000/api/boards/${slug}`);
  let isAuthorized = false;
  if (session) {
    isAuthorized =
      String(data.author) === String(session.user.userId) ||
      data.permissionList.includes(String(session.user.userId));
  }

  return {
    props: {
      bId: data.id,
      bTitle: data.title,
      cards: data.cards,
      lists: data.lists,
      bColor: data.bgcolor,
      isPublic: data.isPublic,
      permissionList: data.permissionList,
      isAuthorized,
      session,
    },
  };
};
