import {
  DragDropContext,
  Draggable,
  Droppable,
  resetServerContext,
} from 'react-beautiful-dnd';
import Card from '../components/Card';
import Column from '../components/Column';
import { useCards } from '../context/CardsContext';
import { useList } from '../context/ListsContext';
import styles from '../styles/Board.module.css';

export default function Home(props) {
  resetServerContext();
  const { currentList, moveList } = useList();
  const { currentCards, moveCard } = useCards();
  function dragEndHandle(e) {
    if (!e.destination) return;
    if (
      e.source.droppableId === e.destination.droppableId &&
      e.source.index === e.destination.index
    ) {
      return;
    }
    console.log(e);
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
          <div className={styles.PageWrapper}>
            <div className={styles.BoardWrapper}>
              {snapshot.draggingOverWith}
              {currentList.map((column, index) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  key={column.id}>
                  {index.toString()}
                  <Column title={column.title} id={column.id} index={index}>
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
                </div>
              ))}
              {provided.placeholder}
            </div>
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
