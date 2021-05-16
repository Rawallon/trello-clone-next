import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ProfileSideBar from '.';

const mockProps = {
  username: 'Test User',
};
let component;
beforeEach(() => {
  component = render(<ProfileSideBar {...mockProps} />);
});

it('should render with passed username', () => {
  expect(component.getByText(mockProps.username)).toBeInTheDocument();
});

it('should have username first letter', () => {
  expect(
    component.getByText(mockProps.username.split('')[0]),
  ).toBeInTheDocument();
});
