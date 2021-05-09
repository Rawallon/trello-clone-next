import React, { useState, useEffect, useRef } from 'react';

export default function AutoResizableTextarea({
  showing,
  text,
  setText,
  placeholder,
  className,
  onChange,
  onKeyPress,
  created,
  setCreated,
}) {
  const textAreaRef = useRef(null);
  const { text, setText } = props;
  const [textAreaHeight, setTextAreaHeight] = useState('auto');
  const [parentHeight, setParentHeight] = useState('auto');

  useEffect(() => {
    setParentHeight(`${textAreaRef.current.scrollHeight}px`);
    setTextAreaHeight(`${textAreaRef.current.scrollHeight}px`);
  }, [text]);

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

    }
  };

  return (
    <div
      style={{
        minHeight: parentHeight,
      }}>
      <textarea
        {...props}
        placeholder={placeholder}
        className={className}
        ref={textAreaRef}
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
