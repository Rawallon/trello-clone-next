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

it('Input shoud initially hidden', () => {
  expect(addList.getByText('Add new list')).toBeInTheDocument();
  expect(addList.getByRole('textbox', { hidden: true })).toBeInTheDocument();
});

it('Input shoud appear on button click', () => {
  expect(addList.getByText('Add new list')).toBeInTheDocument();
  fireEvent.click(addList.getByText('Add new list'));
  expect(addList.getByRole('textbox', { hidden: false })).toBeInTheDocument();
});

it('should call createList on button click', () => {
  const addListBtn = addList.getByText('Add list');
  fireEvent.click(addListBtn);
  expect(createListMock).toHaveBeenCalled();
});
