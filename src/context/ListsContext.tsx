import { createContext, useContext, useEffect, useState } from 'react';
import ApiCall from '../utils/API';

export interface List {
  id: string;
  title: string;
}

interface ListContextProps {
  currentList: List[];
  putLists: (fetchedList: List[]) => void;
  createList: (
    boardId: string,
    title: string,
    local?: boolean,
    socket?: any,
    listId?: string,
  ) => void;
  moveList: (
    boardId: string,
    listId: string,
    insertIndex: number,
    local?: boolean,
  ) => void;
  getList: (lID: string) => List;
  updateListTitle: (
    boardId: string,
    listId: string,
    value: string,
    local?: boolean,
  ) => void;
  archiveList: (
    boardId: string,
    listId: string,
    value: boolean,
    local?: boolean,
  ) => void;
}

export const ListContext = createContext({} as ListContextProps);

export function ListContextProvider({ children }) {
  const [currentList, setCurrentList] = useState([]);

  function putLists(fetchedList: List[]) {
    setCurrentList(fetchedList);
  }

  async function createList(
    boardId: string,
    title: string,
    local = false as boolean,
    socket = null as any,
    listId = null as string,
  ) {
    if (!local) {
      const retApi = await ApiCall(`/api/boards/${boardId}/lists`, 'POST', {
        title,
        position: currentList.length + 1,
        boardId,
      });
      if (retApi.success) {
        setCurrentList((oldList) => [...oldList, { id: retApi.id, title }]);
        if (socket) {
          socket.emit('createList', {
            id: boardId,
            data: { id: retApi.id, title },
          });
        }
      }
    } else {
      setCurrentList((oldList) => [...oldList, { id: listId, title }]);
    }
  }

  async function updateListTitle(
    boardId: string,
    listId: string,
    value: string,
    local = false as boolean,
  ) {
    if (!local) {
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
    } else {
      setCurrentList((oldList) =>
        oldList.map((list) =>
          list.id === listId ? { ...list, title: value } : list,
        ),
      );
    }
  }

  async function archiveList(
    boardId: string,
    listId: string,
    value = true as boolean,
    local = false as boolean,
  ) {
    if (!local) {
      const retApi = await ApiCall(`/api/boards/${boardId}/lists`, 'PATCH', {
        closed: value,
        listId,
      });
      if (retApi.success) {
        setCurrentList((oldList) =>
          oldList.filter((list) => list.id !== listId),
        );
      }
    } else {
      setCurrentList((oldList) => oldList.filter((list) => list.id !== listId));
    }
  }

  async function moveList(
    boardId: string,
    listId: string,
    insertIndex: number,
    local = false as boolean,
  ) {
    if (!local) {
      const retApi = await ApiCall(`/api/boards/${boardId}/lists`, 'PATCH', {
        listId,
        insertIndex,
      });
      if (retApi.success) {
        moveUpdateCurrentList(listId, insertIndex);
      }
    } else {
      moveUpdateCurrentList(listId, insertIndex);
    }
  }
  function moveUpdateCurrentList(listId: string, insertIndex: number) {
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
        updateListTitle,
        archiveList,
      }}>
      {children}
    </ListContext.Provider>
  );
}

export const useList = () => useContext(ListContext);
