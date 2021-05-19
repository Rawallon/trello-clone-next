import { fireEvent, render, screen } from '@testing-library/react';
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
beforeEach(() => {
  render(
    <ModalContextProvider>
      <TestComponent />
    </ModalContextProvider>,
  );
});

it('currentModal initial value should be null', () => {
  expect(screen.getByTestId('value')).toHaveTextContent('null');
});

it('currentModal value should be set to true after clicking showModal button', () => {
  expect(screen.getByTestId('value')).toHaveTextContent('null');
  fireEvent.click(screen.getByTestId('showModal'));
  expect(screen.getByTestId('value')).toHaveTextContent('true');
});

it('currentModal value should be set to null after clicking hideModal button', () => {
  expect(screen.getByTestId('value')).toHaveTextContent('null');
  fireEvent.click(screen.getByTestId('showModal'));
  expect(screen.getByTestId('value')).toHaveTextContent('true');
  fireEvent.click(screen.getByTestId('hideModal'));
  expect(screen.getByTestId('value')).toHaveTextContent('null');
});
