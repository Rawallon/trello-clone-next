import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import AddBoardModal from '.';

var modalRoot = document.createElement('div');
modalRoot.setAttribute('id', 'modal');
document.body.appendChild(modalRoot);

const mockProps = {
  toggleModal: jest.fn(),
  createBoard: jest.fn(),
  bgOptions: ['rgb(0, 0, 0)', 'rgb(255, 255, 255)', 'rgb(238, 238, 238)'],
};
let component;
beforeEach(() => {
  component = render(<AddBoardModal {...mockProps} />);
});

it('should render properly', () => {
  expect(component.getByPlaceholderText('Add board title')).toBeInTheDocument();
});

it('should number of color according to props', () => {
  expect(component.getByTestId('color-list').childElementCount).toBe(
    mockProps.bgOptions.length,
  );
});

it('should update input to changed text', async () => {
  const inputTxt = 'Hey';
  const inputField = component.getByPlaceholderText('Add board title');
  fireEvent.change(inputField, { target: { value: inputTxt } });
  await component.rerender(<AddBoardModal {...mockProps} />);
  expect(component.getByDisplayValue(inputTxt)).toBeInTheDocument();
});

it('main card should change color if color is clicked', async () => {
  fireEvent.click(component.getByTestId('color-list').childNodes[1]);
  await component.rerender(<AddBoardModal {...mockProps} />);
  expect(
    component.getByPlaceholderText('Add board title').parentElement,
  ).toHaveStyle('background-color: ' + mockProps.bgOptions[1]);
});

it('should call createBoard on clicking button Create Board', () => {
  fireEvent.click(component.getByText('Create board'));
  expect(mockProps.createBoard).toHaveBeenCalled();
});

it('should call toggleModal on clicking button Cancel', () => {
  fireEvent.click(component.getByText('Cancel'));
  expect(mockProps.toggleModal).toHaveBeenCalled();
});
