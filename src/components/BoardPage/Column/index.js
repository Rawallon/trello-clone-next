import { useState } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import AutoResizableTextarea from '../AutoResizableTextarea';
import { PlusIcon } from '../../Icons';
import styles from './column.module.css';

export default function Column({
  title = '',
  id,
  index,
  createCard,
  children,
}) {
  const [text, setText] = useState('');
  const [shouldClearText, setShouldClearText] = useState(false);
  const [showForm, setShowForm] = useState(false);

  function createCardHandler() {
    createCard(text, id);
    setShowForm(false);
    setShouldClearText(true);
  }

  function onPassHandler(e) {
    if (e.charCode === 13) {
      createCardHandler();
    }
  }
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
              <PlusIcon /> Add card
            </button>
          </footer>
          <footer
            className={`${styles.footerColumn}
              ${showForm ? '' : styles.hidden}`}>
            <div className={styles.TextareaWrapper}>
              <AutoResizableTextarea
                showing={showForm.toString()}
                text={text}
                setText={setText}
                placeholder="Enter a title for this card..."
                className={styles.AutoTextarea}
                onKeyPress={onPassHandler}
                shouldClearText={shouldClearText}
                setShouldClearText={setShouldClearText}
              />
            </div>
            <button className={styles.addCard} onClick={createCardHandler}>
              Add card
            </button>
          </footer>
        </div>
      )}
    </Draggable>
  );
}
