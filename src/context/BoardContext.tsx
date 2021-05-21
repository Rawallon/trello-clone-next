import { createContext, useContext, useState } from 'react';
import ApiCall from '../utils/API';
import { Card } from './CardsContext';
import { List } from './ListsContext';

export interface Board {
  id: string;
  title: string;
  bgcolor: string;
  lists: List;
  cards: Card;
}

interface BoardContextData {
  myBoards: Board[];
  bgOptions: string[];
  title: string;
  bgColor: string;
  putMyBoards: (boards: Board[]) => void;
  createNewBoard: (title: string, bgcolor: string) => void;
  putBoardData: (title: string, bgcolor: string) => void;
  changeBoard: (boardId: string, field: string, value: string) => void;
}
export const BoardContext = createContext({} as BoardContextData);

const bgOptions: string[] = [
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

  function putBoardData(title: string, bgColor: string) {
    setTitle(title);
    setBgColor(bgColor);
  }

  function putMyBoards(boards: any[]) {
    setMyBoards(boards);
  }
  async function createNewBoard(title: string, bgColor: string) {
    const userId = 1;
    const retApi = await ApiCall(`/user/${userId}/board`, 'POST', {
      title,
      bgColor,
    });
    setMyBoards(retApi);
  }

  async function changeBoard(boardId: string, field: string, value: string) {
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
        bgOptions,
        title,
        bgColor,
        putMyBoards,
        createNewBoard,
        putBoardData,
        changeBoard,
      }}>
      {children}
    </BoardContext.Provider>
  );
}

export const useBoard = () => useContext(BoardContext);
