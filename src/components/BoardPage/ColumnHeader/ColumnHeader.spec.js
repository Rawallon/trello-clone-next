import { fireEvent, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import ColumnHeader from '.';

const mockProps = {
  title: 'Test board',
  changeTitleHandler: jest.fn(),
  changeBgHandler: jest.fn(),
  bgOptions: [1, 2, 3, 4],
};
var columnHeader;
beforeEach(() => {
  columnHeader = render(<ColumnHeader {...mockProps} />);
});

it('should render properly with passed props', () => {
  expect(columnHeader.getAllByText(mockProps.title)[0]).toBeInTheDocument();
});

it('should render number of bgOptions correctly ', () => {
  const colours = columnHeader.getByTestId('bg-colors');
  expect(colours).toBeInTheDocument();
  expect(colours.childElementCount).toBe(mockProps.bgOptions.length);
});

it('should call changeBgHandler when clicking one of bgOptions ', () => {
  const colours = columnHeader.getByTestId('bg-colors');
  expect(colours).toBeInTheDocument();
  fireEvent.click(colours.firstChild);
  expect(mockProps.changeBgHandler).toHaveBeenCalled();
});

it('should add display class to menu after clicking menu button', () => {
  const colours = columnHeader.getByTestId('bg-colors').parentNode;
  expect(colours).not.toHaveClass('display');
  fireEvent.click(columnHeader.getByText('Menu'));
  expect(colours).toHaveClass('display');
});

it('should remove display class on click close button', async () => {
  const colours = columnHeader.getByTestId('bg-colors').parentNode;
  expect(colours).not.toHaveClass('display');
  fireEvent.click(columnHeader.getByText('Menu'));
  expect(colours).toHaveClass('display');
  fireEvent.click(columnHeader.getByRole('button', { name: '' }));
  expect(colours).not.toHaveClass('display');
});

it('should have an input on edit board title', async () => {
  expect(columnHeader.getAllByText(mockProps.title).length).toBe(1);
  columnHeader.getByText(mockProps.title).click();
  await columnHeader.rerender(<ColumnHeader {...mockProps} />);
  expect(columnHeader.getByDisplayValue(mockProps.title)).toBeInTheDocument();
});

it('should have call changeTitleHandler input on edit input change', async () => {
  expect(columnHeader.getAllByText(mockProps.title).length).toBe(1);
  columnHeader.getByText(mockProps.title).click();
  await columnHeader.rerender(<ColumnHeader {...mockProps} />);
  const input = columnHeader.getByDisplayValue(mockProps.title);
  expect(input).toBeInTheDocument();
  const newValue = 'whatever';
  fireEvent.change(input, { target: { value: newValue } });
  expect(columnHeader.getByDisplayValue(newValue)).toBeInTheDocument();
});

it('should have call changeTitleHandler input on edit blur', async () => {
  expect(columnHeader.getAllByText(mockProps.title).length).toBe(1);
  columnHeader.getByText(mockProps.title).click();
  const input = await columnHeader.findByDisplayValue(mockProps.title);
  expect(input).toBeInTheDocument();
  input.focus();
  input.blur();
  expect(mockProps.changeTitleHandler).toHaveBeenCalled();
});
