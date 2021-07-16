import React from 'react';
import Image from 'next/image';
import style from './SignInButton.module.css';

export default function SignInButton({ img, text, signIn }) {
  return (
    <button className={style.signIn} onClick={signIn}>
      <Image {...img} width={20} height={20} />
      <span>{text}</span>
    </button>
  );
}
