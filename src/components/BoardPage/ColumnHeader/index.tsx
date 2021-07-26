import { useState } from 'react';
import Link from 'next/link';

import styles from './columnheader.module.css';
import AutoResizableInput from '../AutoResizableInput';
import { CloseIcon, HomeIcon } from '../../Icons';
import { SyntheticEvent } from 'react';

interface ColumnHeaderProps {
  title: string;
  changeTitleHandler: (value: string) => void;
  changeBgHandler: (value: string) => void;
  bgOptions: string[];
  isAuthorized: boolean;
  isPublic: boolean;
  setIsPublicHandler: (value: boolean) => void;
  permissionList: string;
  permissionListHandler: (value: string) => void;
  deleteBoardHandler: () => void;
}

function ColumnHeader({
  title,
  changeTitleHandler,
  changeBgHandler,
  bgOptions,
  isPublic,
  isAuthorized,
  setIsPublicHandler,
  permissionList,
  permissionListHandler,
  deleteBoardHandler,
}: ColumnHeaderProps) {
  const [titleHolder, setTitleHolder] = useState(() => title);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [permissionText, setPermissionText] = useState(
    () => permissionList || '',
  );

  function saveChangeTitle() {
    changeTitleHandler(titleHolder);
    setIsEditingTitle(false);
  }

  const colorMenu = () => {
    return (
      <div className={`${styles.sideMenu} ${isMenuOpen ? styles.display : ''}`}>
        <div>
          <div className={styles.sideHeader}>
            <span>Change Color</span>
            <button
              className={styles.closeButton}
              onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <CloseIcon />
            </button>
          </div>
          <div
            className={`${styles.sideBody} ${styles.sideColors}`}
            data-testid="bg-colors">
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
        <div>
          <div className={styles.sideHeader}>
            <span>Visibility</span>
          </div>
          <fieldset id="visibility">
            <div>
              <input
                type="radio"
                value="public"
                id="public"
                name="visibility"
                checked={isPublic}
                onChange={() => setIsPublicHandler(true)}
              />
              <label htmlFor="public">Anyone with the link</label>
            </div>
            <div>
              <input
                type="radio"
                value="hidden"
                id="hidden"
                name="visibility"
                checked={!isPublic}
                onChange={() => setIsPublicHandler(false)}
              />
              <label htmlFor="hidden">Only invited</label>
            </div>
          </fieldset>
        </div>
        <div>
          <div className={styles.sideHeader}>
            <span>Invited list</span>
          </div>
          <textarea
            rows={5}
            defaultValue={permissionText}
            onChange={(e) => setPermissionText(e.target.value)}
          />
          <div
            className={styles.button + ' ' + styles.addButton}
            onClick={() => permissionListHandler(permissionText)}>
            Add as invited
          </div>
        </div>
        <div
          className={styles.button + ' ' + styles.deleteButton}
          onClick={deleteBoardHandler}>
          <span>Delete board</span>
        </div>
      </div>
    );
  };

  function onKeyPressHandler(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      saveChangeTitle();
      setIsEditingTitle(false);
    }
  }

  return (
    <div className={styles.wrapper}>
      <div>
        <Link href="./">
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
      <div className={styles.flexGrow}>
        {!isEditingTitle ? (
          <div
            className={styles.titleBtn}
            onClick={() =>
              isAuthorized ? setIsEditingTitle(!isEditingTitle) : null
            }>
            {title}
          </div>
        ) : (
          <AutoResizableInput
            shouldFocus={isEditingTitle}
            className={styles.titleText}
            textValue={titleHolder}
            onKeyPress={onKeyPressHandler}
            onChange={setTitleHolder}
            onBlur={saveChangeTitle}
          />
        )}
      </div>
      {isAuthorized && (
        <>
          <div>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>Menu</button>
          </div>
          {colorMenu()}
        </>
      )}
    </div>
  );
}
export default ColumnHeader;
