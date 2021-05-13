import Link from 'next/link';
import { TableIcon } from '../components/Icons';
import styles from '../styles/BoardListing.module.css';

function Home(props) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.profileHolder}>
        <div>
          <div className={styles.profPicture}>R</div>
          <p>
            <b>Rawallon Cardoso</b>
          </p>
        </div>
        <div className={styles.menuItems}>
          <ul>
            <li className={styles.active}>
              <TableIcon />
              <span>Boards</span>
            </li>
            <li>
              <TableIcon />
              <span>Templates</span>
            </li>
          </ul>
        </div>
        <div className={styles.menuBottom}>
          <ul>
            <li>
              <span>Settings</span>
            </li>
            <li>
              <span>Log out</span>
            </li>
          </ul>
        </div>
      </div>
      <div className={styles.boardsHolder}>
        <div className={styles.boardsSection}>
          <div className={styles.boardsHeader}>
            <TableIcon />
            <h3 className={styles.boardsTitle}>Boards</h3>
          </div>
          <div className={styles.boardsList}>
            <Link href="/board/1">
              <a className={styles.boardItem}>
                <div className={styles.boardItemDetailsTitle}>Placeholder</div>
              </a>
            </Link>
            <div className={styles.boardItem + ' ' + styles.addNew}>
              <div
                className={
                  styles.boardItemDetailsTitle +
                  ' ' +
                  styles.boardItemDetailsAdd
                }>
                Create new board
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Home;
