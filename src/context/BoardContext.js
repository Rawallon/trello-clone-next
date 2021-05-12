import { createContext, useContext, useState } from 'react';
import ApiCall from '../utils/API';

export const BoardContext = createContext({});

export function BoardContextProvider({ children }) {
  const [title, setTitle] = useState('');
  const [bgColor, setBgColor] = useState('');
  function putBoardData(title, bgColor) {
    setTitle(title);
    setBgColor(bgColor);
  }

  async function changeBoard(field, value, boardId) {
    const retApi = await ApiCall('/board/' + boardId, 'PATCH', {
      field: field,
      value: value,
    });
    if (field === 'title') setTitle(retApi.title);
    if (field === 'background') setBgColor(retApi.bgcolor);
  }

  return (
    <BoardContext.Provider
      value={{ putBoardData, changeBoard, title, bgColor }}>
      {children}
    </BoardContext.Provider>
  );
}

export const useBoard = () => useContext(BoardContext);
