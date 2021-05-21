import React, { SyntheticEvent, useEffect, useRef, useState } from 'react';
interface AutoResizableInput {
  textValue: string;
  onChange?: (value: string) => void;
  onBlur?: (value: SyntheticEvent) => void;
  onKeyPress?: (value: SyntheticEvent) => void;
  className: string;
  shouldFocus: boolean;
}
export default function AutoResizableInput({
  textValue,
  onChange,
  onBlur,
  onKeyPress,
  className,
  shouldFocus,
}: AutoResizableInput) {
  const spanRef = useRef(null);
  const inputRef = useRef(null);

  const [width, setWidth] = useState(0);
  function onChangeHandler(event: SyntheticEvent) {
    setWidth(spanRef.current.offsetWidth + 18);
    if (onChange) {
      onChange((event.target as HTMLInputElement).value);
    }
  }

  function onBlurHandler(event: SyntheticEvent) {
    if (onBlur) {
      onBlur(event);
    }
  }

  function onKeyPressHandler(event: SyntheticEvent) {
    if (onKeyPress) {
      onKeyPress(event);
    }
  }

  useEffect(() => {
    setWidth(spanRef.current.offsetWidth + 18);
    if (shouldFocus) {
      inputRef.current.focus();
    }
  }, [shouldFocus]);

  return (
    <>
      <span
        style={{ position: 'absolute' }}
        className={className}
        ref={spanRef}>
        {textValue}
      </span>
      <input
        ref={inputRef}
        className={className}
        style={{ width: width + 'px' }}
        type="text"
        value={textValue}
        onKeyPress={onKeyPressHandler}
        onBlur={onBlurHandler}
        onChange={onChangeHandler}
      />
    </>
  );
}
