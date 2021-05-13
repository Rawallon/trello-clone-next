import React from 'react';
import Link from 'next/link';

import styles from './BoardListItem.module.css';

export default function BoardListItem({ link, title, color }) {
  return (
    <Link href={link}>
      <a className={styles.boardItem} style={{ backgroundColor: color }}>
        <div className={styles.boardItemDetailsTitle}>{title}</div>
      </a>
    </Link>
  );
}
