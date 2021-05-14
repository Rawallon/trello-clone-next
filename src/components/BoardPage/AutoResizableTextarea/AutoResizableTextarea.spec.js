import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import AutoResizableTextarea from '.';

var propsMock = {
  textValue: 'test',
  onChange: jest.fn(),
  onBlur: jest.fn(),
  onKeyPress: jest.fn(),
  className: '',
  shouldFocus: false,
  shouldClearText: false,
  setShouldClearText: jest.fn(),
};

let component;
beforeEach(() => {
  component = render(<AutoResizableTextarea {...propsMock} />);
});

it('should render with correct passed data', () => {
  expect(component.getByText(propsMock.textValue)).toBeInTheDocument();
  expect(component.getByDisplayValue(propsMock.textValue)).toBeInTheDocument();
});

it('should call a function if onChange is triggered', async () => {
  const input = component.getByDisplayValue(propsMock.textValue);
  fireEvent.change(input, { target: { value: 'whatever' } });
  expect(propsMock.onChange).toHaveBeenCalled();
});

it('onChange should display updated text', async () => {
  const newValue = 'Hey';
  expect(component.getByText(propsMock.textValue)).toBeInTheDocument();
  propsMock.textValue = newValue;
  await component.rerender(<AutoResizableTextarea {...propsMock} />);
  expect(component.getByText(newValue)).toBeInTheDocument();
});

it('onBlur should call a function', async () => {
  const input = component.getByDisplayValue(propsMock.textValue);
  input.focus();
  input.blur();
  expect(propsMock.onBlur).toHaveBeenCalled();
});

it('should have focus is shouldFocus is true', async () => {
  const input = component.getByDisplayValue(propsMock.textValue);
  propsMock.shouldFocus = true;
  await component.rerender(<AutoResizableTextarea {...propsMock} />);
  expect(input).toHaveFocus();
});

it('if shouldClearText is true call setShouldClearText', async () => {
  const input = component.getByDisplayValue(propsMock.textValue);
  propsMock.shouldClearText = true;
  await component.rerender(<AutoResizableTextarea {...propsMock} />);
  expect(propsMock.setShouldClearText).toHaveBeenCalled();
});
