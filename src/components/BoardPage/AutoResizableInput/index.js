import React, { useEffect, useRef, useState } from 'react';

export default function AutoResizableInput({
  textValue,
  onChange,
  onBlur,
  onKeyPress,
  className,
  shouldFocus,
}) {
  const spanRef = useRef(null);
  const inputRef = useRef(null);

  const [width, setWidth] = useState(0);
  function onChangeHandler(event) {
    // TODO: maybe calculate this better
    setWidth(spanRef.current.offsetWidth + 18);
    if (onChange) {
      onChange(event.target.value);
    }
  }

  function onBlurHandler(event) {
    if (onBlur) {
      onBlur(event);
    }
  }

  function onKeyPressHandler(event) {
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
        style={{ zIndex: '-10', position: 'absolute' }}
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
