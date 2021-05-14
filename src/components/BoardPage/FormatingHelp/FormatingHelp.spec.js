import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import FormatingHelp from '.';

const mockProps = {
  closeHelperHandler: jest.fn(),
};
var formatingHelp;
beforeEach(() => {
  formatingHelp = render(<FormatingHelp {...mockProps} />);
});

it('should render properly', () => {
  expect(formatingHelp.getByText('Formatting help')).toBeInTheDocument();
  expect(formatingHelp.getByRole('button')).toBeInTheDocument();
});

it('should call closeHelperHandler on exit button click ', () => {
  expect(mockProps.closeHelperHandler).toBeCalledTimes(0);
  fireEvent.click(formatingHelp.getByRole('button'));
  expect(mockProps.closeHelperHandler).toBeCalled();
});
