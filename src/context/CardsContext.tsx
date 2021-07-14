import { createContext, useContext, useState } from 'react';
import ApiCall from '../utils/API';

export interface Card {
  id: string;
  name: string;
  description: string;
  list: string;
}

interface FormData {
  name: string;
  list: string;
}

interface CardsContextProps {
  currentCards: Card[];
  putCards: (fetchedCards: Card[]) => void;
  fetchCards: (id: string) => void;
  createInitialCard: (boardId: string, formData: FormData) => void;
  moveCard: (
    boardId: string,
    cardId: string,
    toId: string,
    insertIndex: number,
  ) => void;
  getCard: (cId: String) => Card;
  updateCardData: (boardId: string, newData: Card) => void;
}

export const CardsContext = createContext({} as CardsContextProps);

export function CardsContextProvider({ children }) {
  const [currentCards, setCurrentCards] = useState([]);

  function putCards(fetchedCards: Card[]) {
    setCurrentCards(fetchedCards);
  }

  async function fetchCards(id: string) {
    const retApi = await ApiCall('/board/' + id, 'GET');
    setCurrentCards(retApi.cards);
  }

  async function createInitialCard(boardId: string, formData: FormData) {
    const id = Math.random().toString(10).substr(2, 9);
    const newCard = {
      id: `${id}-card`,
      name: formData.name,
      description: '',
      createdat: Date.now(),
      list: String(formData.list),
    };

    const retApi = await ApiCall(`/api/boards/${boardId}/cards`, 'POST', {
      newCard,
      boardId,
    });
    setCurrentCards((oldcards) => [...oldcards, newCard]);
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

  async function updateCardData(boardId: string, newData: Card) {
    const retApi = await ApiCall(`/api/boards/${boardId}/cards`, 'PUT', {
      newData,
      boardId,
    });
    if (retApi.success) {
      const filterCards = currentCards.map((card) =>
        card.id === newData.id ? newData : card,
      );
      setCurrentCards(filterCards);
    }
  }
  return (
    <CardsContext.Provider
      value={{
        currentCards,
        fetchCards,
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
