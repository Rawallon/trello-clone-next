import { fireEvent, render } from '@testing-library/react';
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
          createNewBoard(1, 'New Board', 'rgb(0, 174, 204)')
        }></button>
    </div>
  );
};
let component;
beforeEach(() => {
  component = render(
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
  expect(component.getByTestId('bgOptions').childElementCount).toBeGreaterThan(
    0,
  );
  expect(component.getByTestId('bgColor')).toHaveTextContent('');
  expect(component.getByTestId('title')).toHaveTextContent('');
  expect(component.getByTestId('myBoards')).toHaveTextContent('');
});

it('should define board title and bgColor when runing putBoardData function', () => {
  fireEvent.click(component.getByTestId('putBoardData'));
  expect(component.getByTestId('title')).toHaveTextContent('Test Board');
  expect(component.getByTestId('bgColor')).toHaveTextContent('#000');
});

it('should define update board title when runing changeBoard function', async () => {
  fireEvent.click(component.getByTestId('changeBoardTitle'));
  expect(await component.findByText('Tested Board')).toBeInTheDocument();
});

it('should define update board bgColor when runing changeBoard function', async () => {
  fireEvent.click(component.getByTestId('changeBoardBg'));
  expect(await component.findByText('#fff')).toBeInTheDocument();
});

it('should add whatever param is sent to putMyBoards as myBoards state', () => {
  fireEvent.click(component.getByTestId('putMyBoards'));
  expect(component.getByTestId('myBoards').childElementCount).toBeGreaterThan(
    1,
  );
});

it('should add a new board to end when runing createNewBoard', async () => {
  fireEvent.click(component.getByTestId('createNewBoard'));
  expect(await component.findByText('New Board')).toBeInTheDocument();
});
