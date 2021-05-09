import { createContext, useContext, useEffect, useState } from 'react';

const cardsInitialState = [
  {
    id: '1-card',
    name:
      'Text 1 Text 1 Text 1 Text 1 Text 1 Text 1 Text 1 Text 1 Text 1 Text 1 Text 1 Text 1 Text 1 Text 1 Text 1 ',
    createdat: Date.now(),
    list: '1',
  },
  {
    id: '2-card',
    name: 'Text 2',
    createdat: Date.now(),
    list: '1',
  },
  {
    id: '3-card',
    name: 'Text 3',
    createdat: Date.now(),
    list: '1',
  },
  {
    id: '4-card',
    name: 'Text 4',
    createdat: Date.now(),
    list: '1',
  },
];

export const CardsContext = createContext({});

export function CardsContextProvider({ children }) {
  const [currentCards, setCurrentCards] = useState(cardsInitialState);

  function putCard(formData) {
    const id = Math.random().toString(10).substr(2, 9);
    setCurrentCards((prevCards) => [
      ...prevCards,
      {
        id: `${id}-card`,
        ...formData,
        createdat: Date.now(),
        list: '1-board',
      },
    ]);
  }

  function createInitialCard(formData) {
    const id = Math.random().toString(10).substr(2, 9);
    setCurrentCards((prevCards) => [
      ...prevCards,
      {
        id: `${id}-card`,
        name: formData.name,
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
  return (
    <CardsContext.Provider
      value={{
        currentCards,
        putCard,
        createInitialCard,
        moveCard,
      }}>
      {children}
    </CardsContext.Provider>
  );
}

export const useCards = () => {
  return useContext(CardsContext);
};
