import { TableIcon } from '../../Icons';
import styles from './ProfileSideBar.module.css';

interface ProfileSideBar {
  username: string;
  picture: string;
  signOut: () => void;
}

function ProfileSideBar({ username, picture, signOut }: ProfileSideBar) {
  if (!username) return null;
  return (
    <div className={styles.profileHolder}>
      <div>
        {picture ? (
          <img className={styles.profPicture} src={picture} />
        ) : (
          <div className={styles.profPicture}>{username.split('')[0]}</div>
        )}
        <div className={styles.profName}>
          <b>{username}</b>
        </div>
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
          <li onClick={signOut}>
            <span>Log out</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
export default ProfileSideBar;
