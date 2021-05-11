import Link from 'next/link';

function Home(props) {
  return (
    <div
      style={{
        fontSize: '10rem',
      }}>
      <Link href="/board/1">Go to demo board</Link>
    </div>
  );
}
export default Home;
