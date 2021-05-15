import {
  fireEvent,
  getByDisplayValue,
  getByText,
  prettyDOM,
  render,
  screen,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ModalPortal from '.';
import marked from 'marked';
import {
  ModalContext,
  ModalContextProvider,
} from '../../../context/ModalContext';

var modalRoot = document.createElement('div');
modalRoot.setAttribute('id', 'modal');
document.body.appendChild(modalRoot);

jest.mock('marked', () => jest.fn());
const mockProps = {
  getCard: jest.fn(),
  getList: jest.fn(),
  updateCardData: jest.fn(),
};
const mockCardData = {
  id: 1,
  name: 'test card',
  list: '1',
  description: 'test',
};
mockProps.getCard.mockReturnValue({
  id: mockCardData.id,
  name: mockCardData.name,
  list: mockCardData.list,
  description: mockCardData.description,
});
mockProps.getList.mockReturnValue({ title: 'asd' });
let component;
beforeEach(() => {
  component = render(<ModalPortal {...mockProps} />);
});

it('should render modal calling getList and getCard function', () => {
  expect(component.getByText('Description')).toBeInTheDocument();
  expect(mockProps.getCard).toHaveBeenCalled();
  expect(mockProps.getList).toHaveBeenCalled();
  expect(component.getByText(mockCardData.name)).toBeInTheDocument();
});

it('editing description value should update textarea', async () => {
  const newDesc = 'Nice';
  fireEvent.click(component.getByRole('button', { name: 'Edit' }));
  await component.rerender(<ModalPortal {...mockProps} />);
  const textArea = component.getByDisplayValue(mockCardData.description);
  fireEvent.change(textArea, { target: { value: newDesc } });
  expect(component.getByDisplayValue(newDesc)).toBeInTheDocument();
});

it('should hide input on clicking save ', async () => {
  fireEvent.click(component.getByRole('button', { name: 'Edit' }));
  await component.rerender(<ModalPortal {...mockProps} />);
  fireEvent.click(component.getByText('Save'));
  const textBox = await component.getAllByRole('textbox');
  expect(textBox).toHaveLength(1);
});

it('should call hideModal and updateCardData function on modal close', async () => {
  const hideModal = jest.fn();
  await component.rerender(
    <ModalContext.Provider value={{ hideModal }}>
      <ModalPortal {...mockProps} />
    </ModalContext.Provider>,
  );
  fireEvent.click(component.getByRole('button', { name: 'Close' }));
  expect(hideModal).toHaveBeenCalled();
  expect(mockProps.updateCardData).toHaveBeenCalled();
});
