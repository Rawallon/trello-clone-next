import { fireEvent, render } from '@testing-library/react';
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
  expect(component.getAllByText(mockProps.title).length).toBeGreaterThan(0);
});

it('should call createCard on addButton click', () => {
  const addCardBtn = component.getAllByText('Add card')[1];
  expect(addCardBtn).toBeInTheDocument();
  fireEvent.click(addCardBtn);
  expect(mockProps.createCard).toHaveBeenCalled();
});

it('should render children', () => {
  expect(component.getByText('Children Test')).toBeInTheDocument();
});
