import React, { useState, useEffect, useRef } from 'react';

export default function AutoResizableTextarea({
  showing,
  text,
  setText,
  placeholder,
  className,
  onChange,
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
  }, [text]);

  useEffect(() => {
    if (shouldClearText) {
      textAreaRef.current.value = '';
      setShouldClearText(false);
    }

    if (showing) {
      textAreaRef.current.focus();
    }
  }, [shouldClearText, showing]);

  function onChangeHandler(event) {
    setTextAreaHeight('auto');
    setParentHeight(`${textAreaRef.current.scrollHeight}px`);
    setText(event.target.value);
    if (onChange) {
      onChange(event);
    }
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
        defaultValue={text}
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
