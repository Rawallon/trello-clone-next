import { useEffect } from 'react';
import {
  DragDropContext,
  Draggable,
  Droppable,
  resetServerContext,
} from 'react-beautiful-dnd';
import AddList from '../../components/AddList';
import Card from '../../components/Card';
import Column from '../../components/Column';
import ModalPortal from '../../components/ModalPortal';
import { useCards } from '../../context/CardsContext';
import { useList } from '../../context/ListsContext';
import { useModal } from '../../context/ModalContext';
import styles from '../../styles/Board.module.css';
import ApiCall from '../../utils/API';
import ColumnHeader from '../../components/ColumnHeader';

export default function BoardSlug({
  listId,
  listTitle,
  cards,
  lists,
  bgColor,
}) {
  resetServerContext();

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
      putCards(cards);
    }
    if (typeof lists === 'object' && Object.keys(lists).length > 0) {
      putLists(lists);
    }
  }, [cards, lists]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      fetchCards(listId);
    }
  }, []);

  function createCard(name, list) {
    // Todo: Verifications...
    if (!String(name) || !String(list)) return;
    createInitialCard({ name, list });
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
      moveCard(e.draggableId, e.destination.droppableId, e.destination.index);
    }
    if (e.type === 'COLUMN') {
      moveList(e.draggableId, e.destination.index);
    }
  }
  return (
    <DragDropContext onDragEnd={dragEndHandle}>
      <div
        className={styles.backgroundHolder}
        style={{ backgroundColor: '#' + bgColor }}
      />
      <ModalPortal
        getList={getList}
        getCard={getCard}
        updateCardData={updateCardData}
      />
      <ColumnHeader
        changeBgHandler={(value) => changeBoard('background', value, bId)}
        changeTitleHandler={(value) => changeBoard('title', value, bId)}
        favoriteHandler={() => console.log('hey qt')}
        title={bTitle}
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
            <AddList createList={createList} />
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export async function getStaticPaths() {
  return {
    paths: [
      { params: { slug: '1' } }, // See the "paths" section below
    ],
    fallback: 'blocking', // See the "fallback" section below
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
