import { useState } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import AutoResizableTextarea from '../AutoResizableTextarea';
import styles from './column.module.css';

export default function Column({ title = '', id, index, children }) {
  const [text, setText] = useState('');
  const [showForm, setShowForm] = useState(false);
  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <div
          className={styles.column}
          ref={provided.innerRef}
          {...provided.draggableProps}
          id={id}>
          <div className={styles.title} id={id} {...provided.dragHandleProps}>
            {title}
          </div>
          <Droppable type="CARD" key={id} droppableId={String(id)}>
            {(provided, snapshot) => (
              <div
                className={styles.droppable}
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
          <footer
            className={`${styles.footerColumn} ${
              showForm ? styles.hidden : ''
            }`}>
            <button
              className={styles.openForm}
              onClick={() => setShowForm((prev) => !prev)}>
              Add card
            </button>
          </footer>
          <footer
            className={`${styles.footerColumn}
              ${showForm ? '' : styles.hidden}`}>
            <div className={styles.TextareaWrapper}>
              <AutoResizableTextarea
                text={text}
                setText={setText}
                placeholder="Enter a title for this card..."
                className={styles.AutoTextarea}
              />
            </div>
            <button
              className={styles.addCard}
              onClick={() => setShowForm((prev) => !prev)}>
              Add card
            </button>
          </footer>
        </div>
      )}
    </Draggable>
  );
}
