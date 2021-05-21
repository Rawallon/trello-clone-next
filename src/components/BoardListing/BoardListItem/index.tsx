import React from 'react';
import Link from 'next/link';
import styles from './boardlistitem.module.css';

interface BoardListItemProps {
  link: string;
  title: string;
  color: string;
}
export default function BoardListItem({
  link,
  title,
  color,
}: BoardListItemProps) {
  return (
    <Link href={link}>
      <a className={styles.boardItem} style={{ backgroundColor: color }}>
        <div className={styles.boardItemDetailsTitle}>{title}</div>
      </a>
    </Link>
  );
}
