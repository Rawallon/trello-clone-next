import { ReactNode } from 'react';
import styles from './card.module.css';

interface CardProps {
  id: string;
  children: ReactNode;
}

export default function Card({ id, children }: CardProps) {
  return (
    <div className={styles.body} id={id} draggable="true">
      {children}
    </div>
  );
}
