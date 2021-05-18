import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { server } from '../mocks/server';
import '@testing-library/jest-dom/extend-expect';
import { CardsContextProvider, useCards } from './CardsContext';

const TestComponent = () => {
  const {      currentCards,
    fetchCards,
    putCards,
    updateCardData,
    createInitialCard,
    getCard,
    moveCard, } = useCards();
  return (
    <div>
      {currentCards.length > 0 ? 
      <div data-testid="getCard" >{getCard('1-card')?.id}</div> : '' }
      <div data-testid="value">{currentCards.map((card) => <div key={card.id}>{card.name}</div>)}</div>
      <button data-testid="putCards" onClick={() => putCards([{
        id: 'test-card',
        name: 'Put Card',
        description: '# Test',
        list: '1',
      }])}></button>
      <button data-testid="fetchCards" onClick={() => fetchCards(1)}></button>
      <button data-testid="createInitialCard" onClick={() => createInitialCard(1,{name:"Not a test card", list: '1'},1)}></button>
      <button data-testid="moveCard" onClick={() => moveCard(1,'1-card', '2', '3')}></button>
      <button data-testid="updateCardData" onClick={() => updateCardData(1,{
        id: 'test-card',
        name: 'Tested Card',
      })}></button>
    </div>
  );
};
let component;
beforeEach(() => {
  component = render(
    // No need to cleanup since context is re-created each time
    <CardsContextProvider>
      <TestComponent />
    </CardsContextProvider>,
  );
});

beforeAll(() => {
  // Enable the mocking in tests.
  server.listen();
});

afterEach(() => {
  // Reset any runtime handlers tests may use.
  server.resetHandlers();
});

afterAll(() => {
  // Clean up once the tests are done.
  server.close();
});

it('currentList initial value should be an empty array', () => {
  expect(component.getByTestId('value').textContent).toBe('');
});

it('currentList value should be filled an with an item after clcking putCards', async () => {
  expect(component.getByTestId('value').textContent).toBe('');
  fireEvent.click(component.getByTestId('putCards'));
  expect(component.getByText('Put Card')).toBeInTheDocument();
});

it('should fill the array with cards from the server when runing fetchCards', async () => {
  expect(component.getByTestId('value').textContent).toBe('');
  fireEvent.click(component.getByTestId('fetchCards')); 
  expect(await component.findByText('Test Card 1')).toBeInTheDocument()
});

it('should contain updated card after runing updateCardData function', async () => {
  expect(component.getByTestId('value').textContent).toBe('');
  fireEvent.click(component.getByTestId('updateCardData'));
  expect(await component.findByText('Tested Card')).toBeInTheDocument();
});

it('should create a new card after runing updateCardData function', async () => {
  expect(component.getByTestId('value').textContent).toBe('');
  fireEvent.click(component.getByTestId('createInitialCard'));
  expect(await component.findByText('Not a test card')).toBeInTheDocument();
});

it('should get first card data with getCard', async () => {
  expect(component.getByTestId('value').textContent).toBe('');
  fireEvent.click(component.getByTestId('fetchCards')); 
  expect(await component.findByText('1-card')).toBeInTheDocument()
});


it('should contain updated card after runing moveCard function', async () => {
  expect(component.getByTestId('value').textContent).toBe('');
  fireEvent.click(component.getByTestId('moveCard'));
  expect(await component.findByText('Test Card 1')).toBeInTheDocument();
});