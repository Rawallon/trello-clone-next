import { createContext, useContext, useState } from 'react';
import ApiCall from '../utils/API';

export const BoardContext = createContext({});

const bgOptions = [
  'rgb(0, 121, 191)',
  'rgb(210, 144, 52)',
  'rgb(81, 152, 57)',
  'rgb(176, 70, 50)',
  'rgb(137, 96, 158)',
  'rgb(205, 90, 145)',
  'rgb(75, 191, 107)',
  'rgb(0, 174, 204)',
  'rgb(131, 140, 145)',
];

export function BoardContextProvider({ children }) {
  const [title, setTitle] = useState('');
  const [bgColor, setBgColor] = useState('');
  const [myBoards, setMyBoards] = useState([]);

  function putBoardData(title, bgColor) {
    setTitle(title);
    setBgColor(bgColor);
  }

  function putMyBoards(boards) {
    setMyBoards(boards);
  }
  async function createNewBoard(title, bgcolor) {
    const retApi = await ApiCall('/user/1/board', 'POST', {
      title,
      bgcolor,
    });
    setMyBoards(retApi);
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
      value={{
        myBoards,
        putMyBoards,
        createNewBoard,
        bgOptions,
        putBoardData,
        changeBoard,
        title,
        bgColor,
      }}>
      {children}
    </BoardContext.Provider>
  );
}

export const useBoard = () => useContext(BoardContext);
