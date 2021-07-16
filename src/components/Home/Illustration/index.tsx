import Image from 'next/image';
import React from 'react';
import illustrationImg from '../assets/illustration.svg';

export function Illustration() {
  return (
    <>
      <Image {...illustrationImg} layout="intrinsic" />
    </>
  );
}
