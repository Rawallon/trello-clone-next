import React, { useState, useEffect, useRef } from 'react';

export default function AutoResizableTextarea(props) {
  const textAreaRef = useRef(null);
  const { text, setText } = props;
  const [textAreaHeight, setTextAreaHeight] = useState('auto');
  const [parentHeight, setParentHeight] = useState('auto');

  useEffect(() => {
    setParentHeight(`${textAreaRef.current.scrollHeight}px`);
    setTextAreaHeight(`${textAreaRef.current.scrollHeight}px`);
  }, [text]);

  const onChangeHandler = (event) => {
    setTextAreaHeight('auto');
    setParentHeight(`${textAreaRef.current.scrollHeight}px`);
    setText(event.target.value);

    if (props.onChange) {
      props.onChange(event);
    }
  };

  return (
    <div
      style={{
        minHeight: parentHeight,
      }}>
      <textarea
        {...props}
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
