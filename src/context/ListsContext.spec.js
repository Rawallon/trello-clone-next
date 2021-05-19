import { fireEvent, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { server } from '../mocks/server';
import '@testing-library/jest-dom/extend-expect';
import { ListContextProvider, useList } from './ListsContext';
import { useState } from 'react';

const TestComponent = () => {
  const { currentList, putLists, createList, moveList, getList } = useList();
  const [gottenList, setGottenList] = useState(null);
  function runGetList() {
    setGottenList(getList('1'));
  }
  return (
    <div>
      <div data-testid="gList">{gottenList?.title}</div>
      <div data-testid="value">{currentList.map((list) => list.title)}</div>
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
      <button data-testid="getList" onClick={runGetList}></button>
    </div>
  );
};
let component;
beforeEach(() => {
  component = render(
    // No need to cleanup since context is re-created each time
    <ListContextProvider>
      <TestComponent />
    </ListContextProvider>,
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

it('currentList value should be filled array after clcking putLists', () => {
  expect(component.getByTestId('value').textContent).toBe('');
  fireEvent.click(component.getByTestId('putLists'));
  expect(component.getByTestId('value').textContent).toContain('Doing');
  expect(component.getByTestId('value').textContent).toContain('Done');
});

it('should move list poisiton when using moveList', async () => {
  expect(component.getByTestId('value').textContent).toBe('');
  userEvent.click(component.getByTestId('moveList'));
  expect(await component.findByText('DoneDoing')).toBeInTheDocument();
});

it('should add to list when calling createList', async () => {
  expect(component.getByTestId('value').textContent).toBe('');
  userEvent.click(component.getByTestId('createList'));
  expect(await component.findByText('DoneDoingTest')).toBeInTheDocument();
});

it('should return a single list after runing getList', async () => {
  expect(component.getByTestId('value').textContent).toBe('');
  userEvent.click(component.getByTestId('putLists'));
  userEvent.click(component.getByTestId('getList'));
  expect(await component.findByText('Doing')).toBeInTheDocument();
});
