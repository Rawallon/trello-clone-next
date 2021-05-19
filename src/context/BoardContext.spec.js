import { fireEvent, render, screen } from '@testing-library/react';
import { server } from '../mocks/server';
import '@testing-library/jest-dom/extend-expect';
import { BoardContextProvider, useBoard } from './BoardContext';

const TestComponent = () => {
  const {
    myBoards,
    putMyBoards,
    createNewBoard,
    bgOptions,
    putBoardData,
    changeBoard,
    title,
    bgColor,
  } = useBoard();
  return (
    <div>
      <div data-testid="title">{title}</div>
      <div data-testid="bgColor">{bgColor}</div>
      <div data-testid="bgOptions">
        {bgOptions.map((b) => (
          <div key={b}>{b}</div>
        ))}
      </div>
      {myBoards && (
        <div data-testid="myBoards">
          {myBoards.map((b) => (
            <div key={b.title}>{b.title}</div>
          ))}
        </div>
      )}

      <button
        data-testid="putBoardData"
        onClick={() => putBoardData('Test Board', '#000')}></button>
      <button
        data-testid="changeBoardTitle"
        onClick={() => changeBoard(1, 'title', 'Tested Board')}></button>
      <button
        data-testid="changeBoardBg"
        onClick={() => changeBoard(1, 'background', '#fff')}></button>
      <button
        data-testid="putMyBoards"
        onClick={() =>
          putMyBoards([{ title: 1 }, { title: 2 }, { title: 3 }])
        }></button>
      <button
        data-testid="createNewBoard"
        onClick={() =>
          createNewBoard('New Board', 'rgb(0, 174, 204)')
        }></button>
    </div>
  );
};
beforeEach(() => {
  render(
    <BoardContextProvider>
      <TestComponent />
    </BoardContextProvider>,
  );
});

beforeAll(() => {
  server.listen();
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});

it('currentList initial value should be an empty values but bgOptions', () => {
  expect(screen.getByTestId('bgOptions').childElementCount).toBeGreaterThan(0);
  expect(screen.getByTestId('bgColor')).toHaveTextContent('');
  expect(screen.getByTestId('title')).toHaveTextContent('');
  expect(screen.getByTestId('myBoards')).toHaveTextContent('');
});

it('should define board title and bgColor when runing putBoardData function', () => {
  fireEvent.click(screen.getByTestId('putBoardData'));
  expect(screen.getByTestId('title')).toHaveTextContent('Test Board');
  expect(screen.getByTestId('bgColor')).toHaveTextContent('#000');
});

it('should define update board title when runing changeBoard function', async () => {
  fireEvent.click(screen.getByTestId('changeBoardTitle'));
  expect(await screen.findByText('Tested Board')).toBeInTheDocument();
});

it('should define update board bgColor when runing changeBoard function', async () => {
  fireEvent.click(screen.getByTestId('changeBoardBg'));
  expect(await screen.findByText('#fff')).toBeInTheDocument();
});

it('should add whatever param is sent to putMyBoards as myBoards state', () => {
  fireEvent.click(screen.getByTestId('putMyBoards'));
  expect(screen.getByTestId('myBoards').childElementCount).toBeGreaterThan(1);
});

it('should add a new board to end when runing createNewBoard', async () => {
  fireEvent.click(screen.getByTestId('createNewBoard'));
  expect(await screen.findByText('New Board')).toBeInTheDocument();
});
