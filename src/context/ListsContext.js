import { createContext, useContext, useEffect, useState } from 'react';

const listInitialState = [
  {
    id: '1',
    title: 'Doing',
  },
  {
    id: '2',
    title: 'Done',
  },
];

export const ListContext = createContext({});

export function ListContextProvider({ children }) {
  const [currentList, setCurrentList] = useState(listInitialState);

  function putList(formData) {
    setCurrentList((prevList) => [
      ...prevList,
      {
        id: String(currentList.length + 1),
        title: formData.title,
      },
    ]);
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

  function moveList(listId, insertIndex) {
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
        putList,
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
