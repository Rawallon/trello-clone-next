import React, { useState, useEffect, useRef } from 'react';

export default function AutoResizableTextarea({
  showing,
  text,
  setText,
  placeholder,
  className,
  onChange,
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
    textAreaRef.current.value = '';
    setShouldClearText(false);
  }, [shouldClearText]);

  useEffect(() => {
    if (showing) {
      textAreaRef.current.focus();
    }
  }, [showing]);
  const onChangeHandler = (event) => {
    setTextAreaHeight('auto');
    setParentHeight(`${textAreaRef.current.scrollHeight}px`);
    setText(event.target.value.replace(/(?:\r\n|\r|\n)/g, ' '));

    if (onChange) {
      onChange(event);
    }
  };

  const onKeyPressHandler = (event) => {
    if (onKeyPress) {
      onKeyPress(event);
    }
  };

  return (
    <div
      style={{
        minHeight: parentHeight,
      }}>
      <textarea
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
      />
    </div>
  );
}
