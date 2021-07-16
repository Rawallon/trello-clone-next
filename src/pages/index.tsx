import { signIn, signOut, useSession } from 'next-auth/client';
import { SignInForm } from '../components/Home/SignInForm';
import { Illustration } from '../components/Home/Illustration';
import styles from '../styles/Home.module.css';
import Link from 'next/link';

function Home() {
  return (
    <div className={styles.container}>
      <SignInForm signIn={signIn} />
      <Illustration />
      <Link href="/boards">ads</Link>
    </div>
  );
}
export default Home;
