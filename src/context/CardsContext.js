import { createContext, useContext, useState } from 'react';
import ApiCall from '../utils/API';

export const CardsContext = createContext({});

export function CardsContextProvider({ children }) {
  const [currentCards, setCurrentCards] = useState([]);

  function putCards(fetchedCards) {
    setCurrentCards(fetchedCards);
  }

  async function fetchCards(id) {
    const retApi = await ApiCall('/board/' + id, 'GET');
    setCurrentCards(retApi.cards);
  }

  async function createInitialCard(formData) {
    const id = Math.random().toString(10).substr(2, 9);
    const newCard = {
      id: `${id}-card`,
      name: formData.name,
      description: '',
      createdat: Date.now(),
      list: String(formData.list),
    };

    const retApi = await ApiCall('/board/1/card', 'POST', newCard);
    setCurrentCards(retApi);
  }

  async function moveCard(cardId, toId, insertIndex) {
    const retApi = await ApiCall('/board/1/card', 'PATCH', {
      cardId,
      toId,
      insertIndex,
    });
    setCurrentCards(retApi);
  }

  function getCard(cID) {
    return currentCards.filter((card) => card.id === cID)[0];
  }

  async function updateCardData(newData) {
    // put request with new data
    const retApi = await ApiCall('/board/1/card', 'PUT', { newData });
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
