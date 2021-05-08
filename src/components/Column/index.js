import { useState } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import styles from './column.module.css';

export default function Column({ title = '', id, index, children }) {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <div
          className={`${isDraggingOver ? styles.cardColumnDraggingOver : ''} ${
            styles.cardColumn
          }`}
          ref={provided.innerRef}
          {...provided.draggableProps}
          id={id}>
          <div
            className={styles.cardTitle}
            id={id}
            {...provided.dragHandleProps}>
            {title}
          </div>
          <Droppable type="CARD" key={id} droppableId={String(id)}>
            {(provided, snapshot) => (
              <div
                className={styles.cardDroppable}
                style={{
                  backgroundColor: snapshot.isDraggingOver
                    ? 'rgba(0,0,0,0.1)'
                    : 'transparent',
                }}
                ref={provided.innerRef}
                {...provided.droppableProps}>
                {children}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
}
