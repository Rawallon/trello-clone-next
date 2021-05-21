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
    const retApi = await ApiCall(`/board/${boardId}/list`, 'POST', {
      title,
    });
    setCurrentList(retApi);
  }

  async function moveList(
    boardId: string,
    listId: string,
    insertIndex: number,
  ) {
    const retApi = await ApiCall(`/board/${boardId}/list`, 'PATCH', {
      listId,
      insertIndex,
    });
    setCurrentList(retApi);
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
