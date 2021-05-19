import { fireEvent, render, screen } from '@testing-library/react';
import { server } from '../mocks/server';
import '@testing-library/jest-dom/extend-expect';
import { ListContextProvider, useList } from './ListsContext';

const TestComponent = () => {
  const { currentList, putLists, createList, moveList, getList } = useList();
  return (
    <div>
      <div data-testid="gList">
        {currentList.length > 0 && getList('1').title}
      </div>
      <div data-testid="value">
        {currentList.map((list) => (
          <div key={list.title}>{list.title}</div>
        ))}
      </div>
      <button
        data-testid="putLists"
        onClick={() =>
          putLists([
            {
              id: '1',
              title: 'Doing',
            },
            {
              id: '2',
              title: 'Done',
            },
          ])
        }></button>
      <button
        data-testid="createList"
        onClick={() => createList(1, 'Test')}></button>
      <button
        data-testid="moveList"
        onClick={() => moveList(1, '1', 1)}></button>
    </div>
  );
};
beforeEach(() => {
  render(
    <ListContextProvider>
      <TestComponent />
    </ListContextProvider>,
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

it('should add two elemtns on executing putLists', () => {
  fireEvent.click(screen.getByTestId('putLists'));
  const valueChildren = screen.getByTestId('value').children;
  expect(valueChildren.length).toBe(2);
  expect(valueChildren[0]).toHaveTextContent('Doing');
  expect(valueChildren[1]).toHaveTextContent('Done');
});

it('should move list poisition when executing moveList', async () => {
  fireEvent.click(screen.getByTestId('moveList'));
  await screen.findByText('Done');
  const valueChildren = screen.getByTestId('value').children;
  expect(valueChildren[0]).toHaveTextContent('Done');
  expect(valueChildren[1]).toHaveTextContent('Doing');
});

it('should add to list when calling createList', async () => {
  fireEvent.click(screen.getByTestId('createList'));
  await screen.findByText('Test');
  const valueChildren = screen.getByTestId('value').children;
  expect(valueChildren.length).toBe(3);
  expect(valueChildren[2]).toHaveTextContent('Test');
});

it('should return a single list after runing getList', () => {
  fireEvent.click(screen.getByTestId('putLists'));
  fireEvent.click(screen.getByTestId('putLists'));
  expect(screen.getByTestId('gList')).toHaveTextContent('Doing');
});
