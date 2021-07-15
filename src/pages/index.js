import { signIn, signOut, useSession } from 'next-auth/client';
import Link from 'next/link';
function Home(props) {
  const [session, loading] = useSession();

  console.log(session);
  return (
    <div>
      <Link href={'/boards'}>/boards</Link>

      {!session && (
        <>
          Not signed in <br />
          <button onClick={() => signIn()}>Sign in</button>
        </>
      )}
      {session && (
        <>
          Signed in as {session.user.email} <br />
          <button onClick={() => signOut()}>Sign out</button>
        </>
      )}
    </div>
  );
}
export default Home;
