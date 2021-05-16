import { fireEvent, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { server } from '../mocks/server';
import '@testing-library/jest-dom/extend-expect';
import { ListContextProvider, useList } from './ListsContext';

const TestComponent = () => {
  const { currentList, putLists, createList, moveList, getList } = useList();
  return (
    <div>
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
        onClick={() => createList('Test')}></button>
      <button
        data-testid="moveList"
        onClick={() => moveList(String(1), Number(1))}></button>
      <button data-testid="getList" onClick={() => getList()}></button>
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

it('should add to list when calling creatList', async () => {
  expect(component.getByTestId('value').textContent).toBe('');
  userEvent.click(component.getByTestId('createList'));
  expect(await component.findByText('DoneDoingTest')).toBeInTheDocument();
});
