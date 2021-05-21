import { useState } from 'react';
import styles from './addlist.module.css';

interface AddListProps {
  createList: (title: String) => void;
}

function AddList({ createList }: AddListProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [inputText, setInputText] = useState('');

  function putListHandler() {
    setShowAddForm(false);
    setInputText('');
    createList(inputText);
  }

  function onKeyPressHandler(event) {
    if (event.charCode === 13) {
      putListHandler();
    }
  }

  return (
    <>
      <div
        className={`
    ${styles.listAdd}
    ${showAddForm ? styles.hidden : ''}`}
        onClick={() => setShowAddForm(!showAddForm)}>
        Add new list
      </div>
      <div
        className={`
    ${styles.listAddForm}
    ${showAddForm ? '' : styles.hidden}`}>
        <input
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={onKeyPressHandler}
        />
        <button onClick={putListHandler}>Add list</button>
      </div>
    </>
  );
}
export default AddList;
