import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { ModalContextProvider, useModal } from './ModalContext';

const TestComponent = () => {
  const { currentModal, showModal, hideModal } = useModal();
  return (
    <div>
      <div data-testid="value">{String(currentModal)}</div>
      <button data-testid="showModal" onClick={() => showModal(true)}></button>
      <button data-testid="hideModal" onClick={() => hideModal()}></button>
    </div>
  );
};
let component;
beforeEach(() => {
  component = render(
    // No need to cleanup since context is re-created each time
    <ModalContextProvider>
      <TestComponent />
    </ModalContextProvider>,
  );
});

it('currentModal initial value should be null', () => {
  expect(component.getByTestId('value').textContent).toBe('null');
});

it('currentModal value should be set to true after clicking showModal button', () => {
  expect(component.getByTestId('value').textContent).toBe('null');
  fireEvent.click(component.getByTestId('showModal'));
  expect(component.getByTestId('value').textContent).toBe('true');
});

it('currentModal value should be set to null after clicking hideModal button', () => {
  expect(component.getByTestId('value').textContent).toBe('null');
  fireEvent.click(component.getByTestId('showModal'));
  expect(component.getByTestId('value').textContent).toBe('true');
  fireEvent.click(component.getByTestId('hideModal'));
  expect(component.getByTestId('value').textContent).toBe('null');
});
