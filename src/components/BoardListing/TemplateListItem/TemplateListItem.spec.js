import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import BoardListItem from '.';

const mockProps = {
  link: '/test',
  title: 'Test',
  color: 'rgb(255, 255, 255)',
};
let component;
beforeEach(() => {
  component = render(<BoardListItem {...mockProps} />);
});

it('should render with passed title', () => {
  expect(component.getByText(mockProps.title)).toBeInTheDocument();
});

it('should render with passed link', () => {
  expect(component.getByText(mockProps.title).closest('a')).toHaveAttribute(
    'href',
    mockProps.link,
  );
});

it('should render with passed color', () => {
  expect(component.getByText(mockProps.title).closest('a')).toHaveStyle(
    'background-color: ' + mockProps.color,
  );
});
