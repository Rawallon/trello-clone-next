import React from 'react';
import Image from 'next/image';

import SignInButton from '../SignInButton';
import style from './SignInForm.module.css';

import logo from '../assets/logo.svg';
import google from '../assets/google.svg';
import github from '../assets/github.svg';

export function SignInForm({ signIn }) {
  return (
    <>
      <div className={style.container}>
        <div className={style.signInForm}>
          <div className={style.header}>
            <Image src={logo.src} layout="intrinsic" width={170} height={42} />
          </div>
          <div className={style.separator}>Sign In</div>
          <SignInButton
            signIn={() => signIn('google')}
            img={google}
            text="Sign in with Google"
          />
          <SignInButton
            signIn={() => signIn('github')}
            img={github}
            text="Sign in with Github"
          />
        </div>
      </div>
    </>
  );
}
