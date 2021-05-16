import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import BoardsList from '.';

const mockProps = {
  boards: [{ id: 1, title: 'Test Title', bgcolor: '#000' }],
  showModal: jest.fn(),
};
let component;
beforeEach(() => {
  component = render(<BoardsList {...mockProps} />);
});

it('should render', () => {
  expect(component.getByText('Boards')).toBeInTheDocument();
});

it('should render passed board', () => {
  expect(component.getByText(mockProps.boards[0].title)).toBeInTheDocument();
});

it('should call ShowModal on Create board button click', () => {
  expect(mockProps.showModal).toBeCalledTimes(0);
  fireEvent.click(component.getByText('Create new board'));
  expect(mockProps.showModal).toBeCalledTimes(1);
});
