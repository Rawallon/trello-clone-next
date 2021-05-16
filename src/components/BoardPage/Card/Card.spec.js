import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Card from '.';

const propMock = {
  id: 'test',
  children: <div>Test me</div>,
};
let card;
beforeEach(() => {
  card = render(<Card {...propMock} />);
});

it('should render with child properly', () => {
  expect(card.getByText('Test me')).toBeInTheDocument();
});
