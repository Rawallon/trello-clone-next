import { createContext, useContext, useEffect, useState } from 'react';
import ApiCall from '../utils/API';

export const ListContext = createContext({});

export function ListContextProvider({ children }) {
  const [currentList, setCurrentList] = useState([]);

  function putLists(fetchedList) {
    setCurrentList(fetchedList);
  }

  async function createList(boardId, title) {
    const retApi = await ApiCall(`/board/${boardId}/list`, 'POST', {
      title,
    });
    setCurrentList(retApi);
  }

  async function moveList(boardId, listId, insertIndex) {
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
