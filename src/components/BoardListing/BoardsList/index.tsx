import React from 'react';

import BoardListItem from '../BoardListItem';
import { TableIcon } from '../../Icons';
import styles from './BoardsList.module.css';

interface BoardsList {
  boards: any[];
  showModal: () => void;
}

export default function BoardsList({ boards, showModal }: BoardsList) {
  return (
    <div className={styles.boardsHolder}>
      <div className={styles.boardsSection}>
        <div className={styles.boardsHeader}>
          <TableIcon />
          <h3 className={styles.boardsTitle}>Boards</h3>
        </div>
        <div className={styles.boardsList}>
          {boards.map((b) => (
            <BoardListItem
              key={b.id}
              title={b.title}
              link={`/board/${b.id}`}
              color={b.bgcolor}
            />
          ))}
          <div
            className={styles.boardItem + ' ' + styles.addNew}
            onClick={showModal}>
            <div
              className={
                styles.boardItemDetailsTitle + ' ' + styles.boardItemDetailsAdd
              }>
              Create new board
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
