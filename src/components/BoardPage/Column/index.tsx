import { ReactNode, useState } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import AutoResizableTextarea from '../AutoResizableTextarea';
import { PlusIcon, TrashIcon } from '../../Icons';
import styles from './column.module.css';

interface ColumnProps {
  title: string;
  id: string;
  index: number;
  createCard: (value: string, id: string) => void;
  children: ReactNode;
  isDropDisabled: boolean;
  changeListTitle: (listId: string, title: string) => void;
  archiveListHandler: (listId: string, value: boolean) => void;
}

export default function Column({
  title = '',
  id,
  index,
  createCard,
  children,
  isDropDisabled,
  changeListTitle,
  archiveListHandler,
}: ColumnProps) {
  const [text, setText] = useState('');
  const [editedTitle, setEditedTitle] = useState(() => title);
  const [shouldClearText, setShouldClearText] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  function createCardHandler() {
    createCard(text, id);
    setShowForm(false);
    setShouldClearText(true);
  }

  function onChangeHandler(value: string) {
    if (isEditingTitle) {
      setEditedTitle(value);
    }
  }
  function onKeyDownHandler(e) {
    if (e.charCode === 13) {
      updateTitleHandler();
    }
  }
  function updateTitleHandler() {
    if (editedTitle) {
      if (editedTitle !== title) {
        const confirm = window.confirm(
          'Are you sure you want to change the title?',
        );
        if (confirm) {
          setIsEditingTitle(false);
          changeListTitle(id, editedTitle);
        }
      } else {
        setIsEditingTitle(false);
      }
    }
  }

  function deleteButtonHandler(event) {
    event.stopPropagation();
    if (
      window.confirm(
        `Are you sure you want to delete this column?\n\nATTENTION: This will delete all cards`,
      )
    ) {
      archiveListHandler(id, true);
    }
  }

  return (
    <Draggable draggableId={id} index={index} isDragDisabled={isDropDisabled}>
      {(provided) => (
        <div
          className={styles.column}
          ref={provided.innerRef}
          {...provided.draggableProps}
          id={id}>
          {!isEditingTitle ? (
            <div
              className={styles.title}
              id={id}
              {...provided.dragHandleProps}
              onClick={() => setIsEditingTitle(true)}>
              {title}
              <div id="col-opts" onClick={deleteButtonHandler}>
                <TrashIcon />
              </div>
            </div>
          ) : (
            <AutoResizableTextarea
              className={styles.inputTitle}
              textValue={editedTitle}
              shouldFocus={true}
              placeholder="List title"
              onKeyPress={onKeyDownHandler}
              onBlur={updateTitleHandler}
              onChange={onChangeHandler}
            />
          )}
          <Droppable
            type="CARD"
            key={id}
            droppableId={String(id)}
            isDropDisabled={isDropDisabled}>
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
          {isDropDisabled ? null : (
            <>
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
                    shouldFocus={showForm}
                    textValue={text}
                    onChange={setText}
                    placeholder="Enter a title for this card..."
                    className={styles.AutoTextarea}
                    shouldClearText={shouldClearText}
                    setShouldClearText={setShouldClearText}
                  />
                </div>
                <button className={styles.addCard} onClick={createCardHandler}>
                  Add card
                </button>
              </footer>
            </>
          )}
        </div>
      )}
    </Draggable>
  );
}
