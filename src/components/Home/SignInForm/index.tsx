import React from 'react';
import SignInButton from '../SignInButton';
import style from './SignInForm.module.css';

import google from '../assets/google.svg';
import github from '../assets/github.svg';

export function SignInForm({ signIn }) {
  return (
    <div className={style.signInForm}>
      <h1>Sign In</h1>
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
  );
}
