import styles from './card.module.css';

export default function Card({ id, children }) {
  return (
    <div className={styles.body} id={id} draggable="true">
      {children}
    </div>
  );
}
