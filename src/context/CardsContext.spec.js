import { fireEvent, render, screen } from '@testing-library/react';
import { server } from '../mocks/server';
import '@testing-library/jest-dom/extend-expect';
import { CardsContextProvider, useCards } from './CardsContext';

const TestComponent = () => {
  const {
    currentCards,
    putCards,
    updateCardData,
    createCard,
    getCard,
    moveCard,
  } = useCards();
  return (
    <div>
      {currentCards.length > 0 ? (
        <div data-testid="getCard">{getCard('1-card')?.id}</div>
      ) : (
        ''
      )}
      <div data-testid="value">
        {currentCards.map((card) => (
          <div key={card.id}>{card.name}</div>
        ))}
      </div>
      <button
        data-testid="putCards"
        onClick={() =>
          putCards([
            {
              id: 'test-card',
              name: 'Put Card',
              description: '# Test',
              list: '1',
            },
          ])
        }></button>
      <button
        data-testid="createCard"
        onClick={() =>
          createCard(1, { name: 'Not a test card', list: '1' }, 1)
        }></button>
      <button
        data-testid="moveCard"
        onClick={() => moveCard(1, '1-card', '2', '3')}></button>
      <button
        data-testid="updateCardData"
        onClick={() =>
          updateCardData(1, {
            id: 'test-card',
            name: 'Tested Card',
          })
        }></button>
    </div>
  );
};
beforeEach(() => {
  render(
    <CardsContextProvider>
      <TestComponent />
    </CardsContextProvider>,
  );
});

// Boilerplate for MSWJS
beforeAll(() => {
  server.listen();
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});

it('currentList initial value should be an empty array', () => {
  expect(screen.getByTestId('value')).toHaveTextContent('');
});

it('currentList value should be filled an with an item after clcking putCards', () => {
  expect(screen.getByTestId('value')).toHaveTextContent('');
  fireEvent.click(screen.getByTestId('putCards'));
  expect(screen.getByText('Put Card')).toBeInTheDocument();
});

it('should contain updated card after runing updateCardData function', async () => {
  expect(screen.getByTestId('value')).toHaveTextContent('');
  fireEvent.click(screen.getByTestId('updateCardData'));
  expect(await screen.findByText('Tested Card')).toBeInTheDocument();
});

it('should create a new card after runing updateCardData function', async () => {
  expect(screen.getByTestId('value')).toHaveTextContent('');
  fireEvent.click(screen.getByTestId('createCard'));
  expect(await screen.findByText('Not a test card')).toBeInTheDocument();
});

it('should get first card data with getCard', async () => {
  expect(screen.getByTestId('value')).toHaveTextContent('');
  expect(await screen.findByText('1-card')).toBeInTheDocument();
});

it('should contain updated card after runing moveCard function', async () => {
  expect(screen.getByTestId('value')).toHaveTextContent('');
  fireEvent.click(screen.getByTestId('moveCard'));
  expect(await screen.findByText('Test Card 1')).toBeInTheDocument();
});
