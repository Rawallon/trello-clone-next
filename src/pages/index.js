import {
  DragDropContext,
  Draggable,
  Droppable,
  resetServerContext,
} from 'react-beautiful-dnd';
import AddList from '../components/AddList';
import Card from '../components/Card';
import Column from '../components/Column';
import { useCards } from '../context/CardsContext';
import { useList } from '../context/ListsContext';
import styles from '../styles/Board.module.css';

export default function Home(props) {
  resetServerContext();
  const { createList, currentList, moveList } = useList();
  const { createInitialCard, currentCards, moveCard } = useCards();
  function createCard(name, list) {
    // Todo: Verifications...
    if (!name || !list) return;
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
