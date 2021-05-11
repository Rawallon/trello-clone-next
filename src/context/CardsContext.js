import { createContext, useContext, useEffect, useState } from 'react';

export const CardsContext = createContext({});

export function CardsContextProvider({ children }) {
  const [currentCards, setCurrentCards] = useState([]);

  function putCards(fetchedCards) {
    setCurrentCards(fetchedCards);
  }

  function createInitialCard(formData) {
    const id = Math.random().toString(10).substr(2, 9);
    setCurrentCards((prevCards) => [
      ...prevCards,
      {
        id: `${id}-card`,
        name: formData.name,
        description: '',
        createdat: Date.now(),
        list: String(formData.list + 1),
      },
    ]);
  }

  function moveCard(cardId, toId, insertIndex) {
    const cIndex = currentCards.findIndex((c) => c.id === cardId);
    const newCards = [...currentCards];
    const cCard = newCards.splice(cIndex, 1)[0];
    cCard.list = toId;
    newCards.splice(insertIndex, 0, cCard);
    setCurrentCards(newCards);
  }

  function getCard(cID) {
    return currentCards.filter((card) => card.id === cID)[0];
  }

  function updateCardData(newData) {
    // put request with new data
    const cIndex = currentCards.findIndex((c) => c.id === newData.id);
    const newCards = [...currentCards];
    newCards.splice(cIndex, 1)[0];
    const cCard = newData;
    newCards.splice(cIndex, 0, cCard);
    setCurrentCards(newCards);
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
