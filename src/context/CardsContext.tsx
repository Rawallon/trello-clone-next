import { createContext, useContext, useState } from 'react';
import ApiCall from '../utils/API';

export interface Card {
  id: string;
  name: string;
  description: string;
  list: string;
}

interface CardsContextProps {
  currentCards: Card[];
  putCards: (fetchedCards: Card[]) => void;
  createInitialCard: (boardId: string, name: string, listId: string) => void;
  moveCard: (
    boardId: string,
    cardId: string,
    toId: string,
    insertIndex: number,
  ) => void;
  getCard: (cId: String) => Card;
  updateCardData: (
    boardId: string,
    cardId: string,
    name: string,
    description: string,
  ) => void;
}

export const CardsContext = createContext({} as CardsContextProps);

export function CardsContextProvider({ children }) {
  const [currentCards, setCurrentCards] = useState([]);

  function putCards(fetchedCards: Card[]) {
    setCurrentCards(fetchedCards);
  }

  async function createInitialCard(
    boardId: string,
    name: string,
    listId: string,
  ) {
    const position = currentCards.map((card) => card.list === listId).length;
    const retApi = await ApiCall(`/api/boards/${boardId}/cards`, 'POST', {
      name,
      listId,
      position: position + 1,
    });
    if (retApi.success) {
      setCurrentCards((oldcards) => [
        ...oldcards,
        { id: retApi.id, name, list: listId },
      ]);
    }
  }

  async function moveCard(
    boardId: string,
    cardId: string,
    toId: string,
    insertIndex: number,
  ) {
    const retApi = await ApiCall(`/api/boards/${boardId}/cards`, 'PATCH', {
      cardId,
      toId,
      insertIndex,
      boardId,
    });
    if (retApi.success) {
      const cIndex = currentCards.findIndex((c) => c.id === cardId);
      const newCards = [...currentCards];
      const cCard = newCards.splice(cIndex, 1)[0];
      cCard.list = toId;
      newCards.splice(insertIndex, 0, cCard);
      setCurrentCards(newCards);
    }
  }

  function getCard(cId: String) {
    return currentCards.filter((card) => card.id === cId)[0];
  }

  async function updateCardData(
    boardId: string,
    cardId: string,
    name: string,
    description: string,
  ) {
    const retApi = await ApiCall(`/api/boards/${boardId}/cards`, 'PUT', {
      boardId,
      cardId,
      name,
      description,
    });
    if (retApi.success) {
      setCurrentCards((oldCards) =>
        oldCards.map((card) =>
          card.id === cardId ? { ...card, name, description } : card,
        ),
      );
    }
  }
  return (
    <CardsContext.Provider
      value={{
        currentCards,
        putCards,
        updateCardData,
        createInitialCard,
        getCard,
        moveCard,
      }}>
      {children}
    </CardsContext.Provider>
  );
}

export const useCards = () => {
  return useContext(CardsContext);
};
