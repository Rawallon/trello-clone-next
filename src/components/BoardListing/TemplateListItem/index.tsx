import React from 'react';
import styles from './TemplateListItem.module.css';

interface TemplateListItemProps {
  onClick: () => void;
  title: string;
  color: string;
  listsLength: number;
  cardsLength: number;
}
export default function TemplateListItem({
  onClick,
  title,
  color,
  listsLength,
  cardsLength,
}: TemplateListItemProps) {
  return (
    <a
      className={styles.boardItem}
      style={{ backgroundColor: color }}
      onClick={onClick}>
      <div className={styles.boardItemDetailsTitle}>{title}</div>
      <div className={styles.boardItemDetailsInfo}>
        {listsLength} Lists, {cardsLength} Cards
      </div>
    </a>
  );
}
