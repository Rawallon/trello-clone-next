import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import AddList from '.';

var addList;
var createListMock = jest.fn();
beforeEach(() => {
  addList = render(<AddList createList={createListMock} />);
});

it('should render properly', () => {
  expect(addList.getByText('Add list')).toBeInTheDocument();
});

it('Input shoud initially ', () => {
  expect(addList.getByText('Add new list')).toBeInTheDocument();
  expect(addList.getByRole('textbox', { hidden: true })).toBeInTheDocument();
});

it('Input shoud appear on button click', () => {
  expect(addList.getByText('Add new list')).toBeInTheDocument();
  fireEvent.click(addList.getByText('Add new list'));
  expect(addList.getByRole('textbox', { hidden: false })).toBeInTheDocument();
});

it('onChange should update text input', () => {
  expect(addList.getByText('Add new list')).toBeInTheDocument();
  fireEvent.click(addList.getByText('Add new list'));
  const textInput = addList.getByRole('textbox', { hidden: false });
  expect(textInput).toBeInTheDocument();
  fireEvent.change(textInput, { target: { value: 'test' } });
});

it('pressing enter on input should call createListMock', () => {
  expect(addList.getByText('Add new list')).toBeInTheDocument();
  fireEvent.click(addList.getByText('Add new list'));
  expect(addList.getByRole('textbox', { hidden: false })).toBeInTheDocument();
  fireEvent.keyPress(addList.getByRole('textbox', { hidden: false }), {
    key: 'Enter',
    code: 13,
    charCode: 13,
  });
  expect(createListMock).toHaveBeenCalled();
});

it('should call createList on button click', () => {
  const addListBtn = addList.getByText('Add list');
  fireEvent.click(addListBtn);
  expect(createListMock).toHaveBeenCalled();
});
