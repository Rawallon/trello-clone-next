import { useState } from 'react';
import Link from 'next/link';

import styles from './columnheader.module.css';
import AutoResizableInput from '../AutoResizableInput';
import { CloseIcon, HomeIcon } from '../../Icons';
import { useBoard } from '../../../context/BoardContext';

function ColumnHeader({ title, changeTitleHandler, changeBgHandler }) {
  const { bgOptions } = useBoard();
  const [titleHolder, setTitleHolder] = useState(title);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  function saveChangeTitle() {
    changeTitleHandler(titleHolder);
    setIsEditingTitle(false);
  }

  const colorMenu = () => {
    return (
      <div className={`${styles.sideMenu} ${isMenuOpen ? styles.display : ''}`}>
        <div className={styles.sideHeader}>
          <span>Change Color</span>
          <div
            className={styles.closeButton}
            onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <CloseIcon />
          </div>
        </div>
        <div className={`${styles.sideBody} ${styles.sideColors}`}>
          {bgOptions.map((color, index) => (
            <div
              key={index}
              className={styles.colorOpt}
              style={{ backgroundColor: color }}
              onClick={() => changeBgHandler(color)}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.wrapper}>
      <div>
        <Link href="/">
          <div
            className={styles.titleBtn}
            style={{
              marginRight: '1rem',
              height: '100%',
            }}>
            <HomeIcon />
          </div>
        </Link>
      </div>
      <div style={{ flexGrow: '1' }}>
        {!isEditingTitle ? (
          <div
            className={styles.titleBtn}
            onClick={() => setIsEditingTitle(!isEditingTitle)}>
            {titleHolder}
          </div>
        ) : (
          <AutoResizableInput
            shouldFocus={isEditingTitle}
            className={styles.titleText}
            textValue={titleHolder}
            onChange={setTitleHolder}
            onBlur={saveChangeTitle}
          />
        )}
      </div>
      <div>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)}>Menu</button>
      </div>
      {colorMenu()}
    </div>
  );
}
export default ColumnHeader;
