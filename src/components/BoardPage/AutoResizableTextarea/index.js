import React, { useState, useEffect, useRef } from 'react';

export default function AutoResizableTextarea({
  shouldFocus,
  textValue,
  onChange,
  placeholder,
  className,
  onBlur,
  onKeyPress,
  shouldClearText,
  setShouldClearText,
}) {
  const textAreaRef = useRef(null);
  const [textAreaHeight, setTextAreaHeight] = useState('auto');
  const [parentHeight, setParentHeight] = useState('auto');

  useEffect(() => {
    setParentHeight(`${textAreaRef.current.scrollHeight}px`);
    setTextAreaHeight(`${textAreaRef.current.scrollHeight}px`);
  }, [textValue]);

  useEffect(() => {
    if (shouldClearText) {
      textAreaRef.current.value = '';
      setShouldClearText(false);
    }

    if (shouldFocus) {
      textAreaRef.current.focus();
    }
  }, [shouldClearText, shouldFocus]);

  function onChangeHandler(event) {
    setTextAreaHeight('auto');
    setParentHeight(`${textAreaRef.current.scrollHeight}px`);
    onChange(event.target.value);
  }

  function onKeyPressHandler(event) {
    if (onKeyPress) {
      onKeyPress(event);
    }
  }

  function onBlurHandler(event) {
    if (onBlur) {
      onBlur(event);
    }
  }
  return (
    <div
      style={{
        minHeight: parentHeight,
      }}>
      <textarea
        defaultValue={textValue}
        placeholder={placeholder}
        className={className}
        ref={textAreaRef}
        onKeyPress={onKeyPressHandler}
        rows={1}
        style={{
          height: textAreaHeight,
          minHeight: '20px',
        }}
        onChange={onChangeHandler}
        onBlur={onBlurHandler}
      />
    </div>
  );
}
