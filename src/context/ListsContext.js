import { createContext, useContext, useEffect, useState } from 'react';
import ApiCall from '../utils/API';

export const ListContext = createContext({});

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
    setCurrentList(retApi);
  }

  function getList(lID) {
    return currentList.filter((list) => list.id === lID)[0];
  }

  return (
    <ListContext.Provider
      value={{
        bgOptions,
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
