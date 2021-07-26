import Link from 'next/link';
import { useRouter } from 'next/router';
import { TableIcon } from '../../Icons';
import styles from './ProfileSideBar.module.css';

interface ProfileSideBar {
  username: string;
  picture: string;
  signOut: () => void;
}

function ProfileSideBar({ username, picture, signOut }: ProfileSideBar) {
  const router = useRouter();
  const routes = [
    { name: 'Boards', link: '/boards' },
    { name: 'Templates', link: '/templates' },
  ];

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
          {routes.map((_, index) => (
            <Link href={routes[index].link}>
              <li
                className={
                  routes[index].link === router.route ? styles.active : null
                }>
                <TableIcon />
                <span>{routes[index].name}</span>
              </li>
            </Link>
          ))}
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
