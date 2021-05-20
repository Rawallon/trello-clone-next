import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ModalPortal from '.';
import { ModalContext } from '../../../context/ModalContext';

var modalRoot = document.createElement('div');
modalRoot.setAttribute('id', 'modal');
document.body.appendChild(modalRoot);

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
const _ = jest.mock('marked', () => <div>{mockCardData.description}</div>);
mockProps.getCard.mockReturnValue({
  id: mockCardData.id,
  name: mockCardData.name,
  list: mockCardData.list,
  description: mockCardData.description,
});
mockProps.getList.mockReturnValue({
  id: '1-card',
  name: 'Test Card 1',
  description: '# Test',
  list: '1',
});
const mockContext = {
  currentModal: '1-card',
  showModal: jest.fn(),
  hideModal: jest.fn(),
};
let component;
beforeEach(() => {
  jest.spyOn(window, 'confirm').mockImplementation(() => true);
  component = render(
    <ModalContext.Provider value={{ ...mockContext }}>
      <ModalPortal {...mockProps} />
    </ModalContext.Provider>,
  );
});

it('should render modal calling getList and getCard function', () => {
  expect(component.getByText('Description')).toBeInTheDocument();
  expect(mockProps.getCard).toHaveBeenCalled();
  expect(mockProps.getList).toHaveBeenCalled();
  expect(component.getByText(mockCardData.name)).toBeInTheDocument();
});

it('editing description value should update textarea', () => {
  const newDesc = 'Nice';
  fireEvent.click(component.getByRole('button', { name: 'Edit' }));
  const textArea = component.getByDisplayValue(mockCardData.description);
  fireEvent.change(textArea, { target: { value: newDesc } });
  expect(component.getByDisplayValue(newDesc)).toBeInTheDocument();
});

it('clicking on the description should bring textarea', () => {
  fireEvent.click(component.getByText(mockCardData.description));
  expect(
    component.getByDisplayValue(mockCardData.description),
  ).toBeInTheDocument();
});

it('should hide input on clicking save ', () => {
  fireEvent.click(component.getByRole('button', { name: 'Edit' }));
  fireEvent.click(component.getByText('Save'));
  const textBox = component.getAllByRole('textbox');
  expect(textBox).toHaveLength(1);
});

it('should call hideModal and updateCardData function on modal close', () => {
  const newDesc = 'Nice';
  fireEvent.click(component.getByRole('button', { name: 'Edit' }));
  const textArea = component.getByDisplayValue(mockCardData.description);
  fireEvent.change(textArea, { target: { value: newDesc } });
  jest.spyOn(window, 'confirm').mockImplementation(() => true);
  fireEvent.click(component.getByRole('button', { name: 'Close' }));
  expect(mockContext.hideModal).toHaveBeenCalled();
  expect(mockProps.updateCardData).toHaveBeenCalled();
});

it('should call hideModal and updateCardData function on pressing Esc', () => {
  const newDesc = 'Nice';
  fireEvent.click(component.getByRole('button', { name: 'Edit' }));
  const textArea = component.getByDisplayValue(mockCardData.description);
  fireEvent.change(textArea, { target: { value: newDesc } });
  fireEvent.keyDown(document, { key: 'Escape', code: 'Escape', keyCode: '27' });
  fireEvent.click(component.getByRole('button', { name: 'Close' }));
  expect(mockContext.hideModal).toHaveBeenCalled();
  expect(mockProps.updateCardData).toHaveBeenCalled();
});

it('should open formatting help modal window', () => {
  fireEvent.click(component.getByRole('button', { name: 'Edit' }));
  expect(component.getAllByRole('button', { name: 'Close' }).length).toBe(1);
  fireEvent.click(component.getByRole('button', { name: 'Formatting Help' }));
  expect(component.getAllByRole('button', { name: 'Close' }).length).toBe(2);
});

it('should closes formatting help modal window', () => {
  fireEvent.click(component.getByRole('button', { name: 'Edit' }));
  fireEvent.click(component.getByRole('button', { name: 'Formatting Help' }));
  fireEvent.click(component.getAllByRole('button', { name: 'Close' })[0]);
  expect(component.getAllByRole('button', { name: 'Close' }).length).toBe(1);
});

it('should not render if currentModal has falsy value', async () => {
  mockContext.currentModal = null;
  await component.rerender(
    <ModalContext.Provider value={{ ...mockContext }}>
      <ModalPortal {...mockProps} />
    </ModalContext.Provider>,
  );
});
