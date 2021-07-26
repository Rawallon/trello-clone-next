import { ObjectId } from 'mongodb';
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
  author: ObjectId;
  isPublic: boolean;
  permissionList: ObjectId[];
}

interface BoardContextData {
  myBoards: Board[];
  bgOptions: string[];
  title: string;
  bgColor: string;
  isPublic: boolean;
  putMyBoards: (boards: Board[]) => void;
  createNewBoardFromTemplate: (
    title: string,
    bgcolor: string,
    userId: string,
    templateId: string,
  ) => void;
  createNewBoard: (title: string, bgcolor: string, userId: string) => void;
  putBoardData: (title: string, bgcolor: string, isPublic: boolean) => void;
  changeBoard: (
    boardId: string,
    field: string,
    value: string | boolean | string[],
    local?: boolean,
  ) => void;
  deleteBoard: (boardId: string) => void;
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
  const [isPublic, setIsPublic] = useState(false);

  function putBoardData(title: string, bgColor: string, isPublic: boolean) {
    setTitle(title);
    setBgColor(bgColor);
    setIsPublic(isPublic);
  }

  function putMyBoards(boards: any[]) {
    setMyBoards(boards);
  }

  async function createNewBoard(
    title: string,
    bgColor: string,
    userId: string,
  ) {
    const retApi = await ApiCall(`/api/boards`, 'POST', {
      title,
      bgColor,
      author: userId,
    });
    if (retApi) {
      const newBoard = {
        id: retApi.success,
        title,
        bgcolor: bgColor,
        author: userId,
      };
      setMyBoards((oldBoards) => [...oldBoards, newBoard]);
    }
  }

  async function createNewBoardFromTemplate(
    title: string,
    bgColor: string,
    userId: string,
    templateId: string,
  ) {
    const retApi = await ApiCall(`/api/boards/templates`, 'POST', {
      title,
      bgColor,
      author: userId,
      templateId,
    });
    if (retApi) {
      const newBoard = {
        id: retApi.success,
        title,
        bgcolor: bgColor,
        author: userId,
      };
      setMyBoards((oldBoards) => [...oldBoards, newBoard]);
    }
  }

  async function changeBoard(
    boardId: string,
    field: string,
    value: string | boolean | string[],
    local = false as boolean,
  ) {
    if (!local) {
      const retApi = await ApiCall(`/api/boards/${boardId}`, 'PATCH', {
        field: field,
        value: value,
      });
      if (retApi.success) {
        if (field === 'title') setTitle(String(value));
        else if (field === 'background') setBgColor(String(value));
        else if (field === 'isPublic') setIsPublic(Boolean(value));
      }
    } else {
      if (field === 'title') setTitle(String(value));
      else if (field === 'background') setBgColor(String(value));
    }
  }

  async function deleteBoard(boardId: string) {
    const retApi = await ApiCall(`/api/boards/${boardId}`, 'DELETE');
    if (retApi.success) {
      return true;
    }
    return false;
  }

  return (
    <BoardContext.Provider
      value={{
        myBoards,
        bgOptions,
        title,
        bgColor,
        isPublic,
        putMyBoards,
        createNewBoardFromTemplate,
        createNewBoard,
        putBoardData,
        changeBoard,
        deleteBoard,
      }}>
      {children}
    </BoardContext.Provider>
  );
}

export const useBoard = () => useContext(BoardContext);
