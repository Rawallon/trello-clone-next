import { signIn } from 'next-auth/client';

import { Illustration } from '../components/Home/Illustration';
import { SignInForm } from '../components/Home/SignInForm';

import styles from '../styles/Home.module.css';

function Home() {
  return (
    <div className={styles.container}>
      <SignInForm signIn={signIn} />
      <Illustration />
    </div>
  );
}
export default Home;
