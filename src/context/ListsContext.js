import { createContext, useContext, useEffect, useState } from 'react';
import ApiCall from '../utils/API';

export const ListContext = createContext({});

export function ListContextProvider({ children }) {
  const [currentList, setCurrentList] = useState([]);

  function putLists(fetchedList) {
    setCurrentList(fetchedList);
  }

  function createList(title) {
    setCurrentList((prevList) => [
      ...prevList,
      {
        id: String(currentList.length + 1),
        title,
      },
    ]);
  }

  async function moveList(listId, insertIndex) {
    const retApi = await ApiCall('/board/1/list', 'POST', {
      listId,
      insertIndex,
    });
    console.log(retApi);
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

export const useList = () => {
  return useContext(ListContext);
};
