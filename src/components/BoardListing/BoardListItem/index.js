import React from 'react';
import Link from 'next/link';

import styles from './BoardListItem.module.css';

export default function BoardListItem({ link, title }) {
  return (
    <Link href={link}>
      <a className={styles.boardItem}>
        <div className={styles.boardItemDetailsTitle}>{title}</div>
      </a>
    </Link>
  );
}
