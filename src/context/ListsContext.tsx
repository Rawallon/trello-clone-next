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
  changeListTitle: (boardId: string, listId: string, value: string) => void;
}

export const ListContext = createContext({} as ListContextProps);

export function ListContextProvider({ children }) {
  const [currentList, setCurrentList] = useState([]);

  function putLists(fetchedList: List[]) {
    setCurrentList(fetchedList);
  }

  async function createList(boardId: string, title: string) {
    const retApi = await ApiCall(`/api/boards/${boardId}/lists`, 'POST', {
      title,
      position: currentList.length + 1,
      boardId,
    });
    if (retApi.success) {
      setCurrentList((oldList) => [...oldList, { id: retApi.id, title }]);
    }
  }

  async function changeListTitle(
    boardId: string,
    listId: string,
    value: string,
  ) {
    const retApi = await ApiCall(`/api/boards/${boardId}/lists`, 'PATCH', {
      title: value,
      listId,
    });
    if (retApi.success) {
      setCurrentList((oldList) =>
        oldList.map((list) =>
          list.id === listId ? { ...list, title: value } : list,
        ),
      );
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
    });
    if (retApi.success) {
      const cIndex = currentList.findIndex((c) => c.id === listId);
      const newList = [...currentList];
      newList.splice(insertIndex, 0, newList.splice(cIndex, 1)[0]);
      setCurrentList(newList);
    }
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
        changeListTitle,
      }}>
      {children}
    </ListContext.Provider>
  );
}

export const useList = () => useContext(ListContext);
