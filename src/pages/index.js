import Link from 'next/link';
import AddBoardModal from '../components/BoardListing/AddBoardModal';
import { TableIcon } from '../components/Icons';
import styles from '../styles/BoardListing.module.css';

function Home(props) {
  return (
    <div>
      <Link href={'/boards'}>/boards</Link>
    </div>
  );
}
export default Home;
