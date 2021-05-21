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

    const retApi = await ApiCall(`/board/${boardId}/card`, 'POST', newCard);
    setCurrentCards(retApi);
  }

  async function moveCard(
    boardId: string,
    cardId: string,
    toId: string,
    insertIndex: number,
  ) {
    const retApi = await ApiCall(`/board/${boardId}/card`, 'PATCH', {
      cardId,
      toId,
      insertIndex,
    });
    setCurrentCards(retApi);
  }

  function getCard(cId: String) {
    return currentCards.filter((card) => card.id === cId)[0];
  }

  async function updateCardData(boardId: string, newData: Card) {
    const retApi = await ApiCall(`/board/${boardId}/card`, 'PUT', { newData });
    setCurrentCards(retApi);
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
