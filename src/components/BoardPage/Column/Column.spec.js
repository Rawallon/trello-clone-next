import { fireEvent, prettyDOM, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import Column from '.';

const mockProps = {
  title: 'Test',
  id: '1',
  index: 1,
  createCard: jest.fn(),
};
const children = <div>Children Test</div>;
const onDragEnd = jest.fn();
let component;
beforeEach(() => {
  component = render(
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable direction="horizontal" type="COLUMN" droppableId="board">
        {(provided, snapshot) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            <Column {...mockProps}>{children}</Column>
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>,
  );
});

it('should render properly with passed props', () => {
  expect(component.getByText(mockProps.title)).toHaveTextContent(
    mockProps.title,
  );
});
it('should render properly without passing title', () => {
  var mockPropsWithoutTitle = {
    id: '1',
    index: 1,
    createCard: jest.fn(),
  };
  component.rerender(
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable direction="horizontal" type="COLUMN" droppableId="board">
        {(provided, snapshot) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            <Column {...mockPropsWithoutTitle}>{children}</Column>
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>,
  );
  expect(component.getByText('Children Test')).toBeInTheDocument();
});

it('should call createCard on addButton click', () => {
  const addCardBtn = component.getAllByRole('button', { name: 'Add card' })[1];
  expect(addCardBtn).toBeInTheDocument();
  fireEvent.click(addCardBtn);
  expect(mockProps.createCard).toHaveBeenCalled();
});

it('should render children', () => {
  expect(component.getByText('Children Test')).toBeInTheDocument();
});

it('should turn text visible on clicking "Add card" Button', () => {
  const button = component.getAllByRole('button', { name: 'Add card' })[0];
  fireEvent.click(button);
  const footerCardClass = component.getAllByRole('contentinfo')[0].className;
  expect(footerCardClass).toContain('hidden');
});

it('should call createCard on pressing enter', () => {
  const input = component.getByPlaceholderText(
    'Enter a title for this card...',
  );
  fireEvent.keyPress(input, { key: 'Enter', code: 13, charCode: 13 });

  expect(mockProps.createCard).toHaveBeenCalled();
});
