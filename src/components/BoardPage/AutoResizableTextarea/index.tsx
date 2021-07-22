import React, { useState, useEffect, useRef, SyntheticEvent } from 'react';

interface AutoResizableTextareaProps {
  shouldFocus: boolean;
  textValue: string;
  placeholder: string;
  className?: string;
  onChange: (value: string) => void;
  onBlur?: (value: SyntheticEvent) => void;
  onKeyPress?: (value: SyntheticEvent) => void;
  shouldClearText?: boolean;
  setShouldClearText?: (value: boolean) => void;
  disabled?: boolean;
}

export default function AutoResizableTextarea({
  shouldFocus,
  textValue,
  onChange,
  placeholder,
  className,
  onBlur,
  onKeyPress,
  shouldClearText = false,
  setShouldClearText,
  disabled = false,
}: AutoResizableTextareaProps) {
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
        disabled={disabled}
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
