import { useEffect } from 'react';
import {
  DragDropContext,
  Draggable,
  Droppable,
  resetServerContext,
} from 'react-beautiful-dnd';
import Head from 'next/head';

import styles from '../../styles/Board.module.css';

import AddList from '../../components/BoardPage/AddList';
import Card from '../../components/BoardPage/Card';
import Column from '../../components/BoardPage/Column';
import ModalPortal from '../../components/BoardPage/ModalPortal';
import { useCards } from '../../context/CardsContext';
import { useList } from '../../context/ListsContext';
import { useModal } from '../../context/ModalContext';
import ApiCall from '../../utils/API';
import ColumnHeader from '../../components/BoardPage/ColumnHeader';
import { useBoard } from '../../context/BoardContext';

export default function BoardSlug({ bId, bTitle, cards, lists, bColor }) {
  resetServerContext();
  const { putBoardData, changeBoard, title, bgColor, bgOptions } = useBoard();
  const { createList, putLists, currentList, moveList, getList } = useList();
  const {
    fetchCards,
    createInitialCard,
    putCards,
    currentCards,
    moveCard,
    getCard,
    updateCardData,
  } = useCards();
  const { showModal } = useModal();

  useEffect(() => {
    if (typeof cards === 'object' && Object.keys(cards).length > 0) {
      putBoardData(bTitle, bColor);
      putCards(cards);
      putLists(lists);
    }
  }, [cards, lists]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      fetchCards(bId);
    }
  }, []);
  function updateCardHandler(cardData) {
    updateCardData(bId, cardData);
  }
  function createCard(name, list) {
    // Todo: Verifications...
    if (!String(name) || !String(list)) return;
    createInitialCard(bId, { name, list });
  }
  function dragEndHandle(e) {
    if (!e.destination) return;
    if (
      e.source.droppableId === e.destination.droppableId &&
      e.source.index === e.destination.index
    ) {
      return;
    }
    if (e.type === 'CARD') {
      moveCard(
        bId,
        e.draggableId,
        e.destination.droppableId,
        e.destination.index,
      );
    }
    if (e.type === 'COLUMN') {
      moveList(bId, e.draggableId, e.destination.index);
    }
  }
  function createListHandle(listData) {
    createList(bId, listData);
  }
  return (
    <DragDropContext onDragEnd={dragEndHandle}>
      <Head>
        <title>{title}</title>
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
        favoriteHandler={() => console.log('hey qt')}
        title={bTitle}
        bgOptions={bgOptions}
      />
      <Droppable direction="horizontal" type="COLUMN" droppableId="board">
        {(provided, snapshot) => (
          <div
            className={styles.BoardWrapper}
            ref={provided.innerRef}
            {...provided.droppableProps}>
            {currentList.map((column, index) => (
              <Column
                createCard={createCard}
                title={column.title}
                id={column.id}
                key={column.id}
                index={index}>
                {currentCards
                  .filter((item) => item.list === String(column.id))
                  .map((item, index) => (
                    <Draggable
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
                          <Card>{item.name}</Card>
                          {provided.placeholder}
                        </div>
                      )}
                    </Draggable>
                  ))}
              </Column>
            ))}
            {provided.placeholder}
            <AddList createList={createListHandle} />
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export async function getStaticPaths() {
  return {
    paths: [{ params: { slug: '1' } }],
    fallback: 'blocking',
  };
}

export const getStaticProps = async (ctx) => {
  const { slug } = ctx.params;
  const data = await ApiCall(`http://localhost:3000/board/${slug}`);
  return {
    props: {
      bId: data.id,
      bTitle: data.title,
      cards: data.cards,
      lists: data.lists,
      bColor: data.bgcolor,
    },
  };
};
