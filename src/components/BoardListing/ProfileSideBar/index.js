import { TableIcon } from '../../Icons';
import styles from './ProfileSideBar.module.css';

function ProfileSideBar({ username }) {
  return (
    <div className={styles.profileHolder}>
      <div>
        <div className={styles.profPicture}>{username.split('')[0]}</div>
        <p>
          <b>{username}</b>
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
  );
}
export default ProfileSideBar;
