import { createContext, useContext, useEffect, useState } from 'react';

const listInitialState = [
  {
    id: '1',
    title: 'List 1',
  },
  {
    id: '2',
    title: 'List 2',
  },
  {
    id: '3',
    title: 'List 3',
  },
  {
    id: '4',
    title: 'List 4',
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
        ...formData,
      },
    ]);
  }

  function moveList(listId, insertIndex) {
    const cIndex = currentList.findIndex((c) => c.id === listId);
    const newList = [...currentList];
    newList.splice(insertIndex, 0, newList.splice(cIndex, 1)[0]);
    setCurrentList(newList);
  }
  return (
    <ListContext.Provider
      value={{
        currentList,
        putList,
        moveList,
      }}>
      {children}
    </ListContext.Provider>
  );
}

export const useList = () => {
  return useContext(ListContext);
};
