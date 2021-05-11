import { createContext, useContext, useEffect, useState } from 'react';

export const ListContext = createContext({});

export function ListContextProvider({ children }) {

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
