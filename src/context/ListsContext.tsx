import { createContext, useContext, useState } from 'react';
import ApiCall from '../utils/API';

export interface List {
  id: string;
  title: string;
}

interface ListContextProps {
  currentList: List[];
  putLists: (fetchedList: List[]) => void;
  createList: (boardId: string, title: string) => void;
  moveList: (boardId: string, listId: string, insertIndex: number) => void;
  getList: (lID: string) => List;
}

export const ListContext = createContext({} as ListContextProps);

export function ListContextProvider({ children }) {
  const [currentList, setCurrentList] = useState([]);

  function putLists(fetchedList: List[]) {
    setCurrentList(fetchedList);
  }

  async function createList(boardId: string, title: string) {
    const id = Math.random().toString(10).substr(2, 9);
    const retApi = await ApiCall(`/api/boards/${boardId}/lists`, 'POST', {
      newList: { id: `${id}-card`, title },
      boardId,
    });
    if (retApi.success) {
      setCurrentList((oldList) => [...oldList, { id: `${id}-card`, title }]);
    }
  }

  async function moveList(
    boardId: string,
    listId: string,
    insertIndex: number,
  ) {
    const retApi = await ApiCall(`/api/boards/${boardId}/lists`, 'PATCH', {
      listId,
      insertIndex,
      boardId,
    });

    const cIndex = currentList.findIndex((c) => c.id === listId);
    const newList = [...currentList];
    newList.splice(insertIndex, 0, newList.splice(cIndex, 1)[0]);
    setCurrentList(newList);
  }

  function getList(lID) {
    return currentList.filter((list) => list.id === lID)[0];
  }

  return (
    <ListContext.Provider
      value={{
        currentList,
        putLists,
        createList,
        moveList,
        getList,
      }}>
      {children}
    </ListContext.Provider>
  );
}

export const useList = () => useContext(ListContext);
