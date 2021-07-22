import marked from 'marked';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Card } from '../../../context/CardsContext';
import { List } from '../../../context/ListsContext';
import { useModal } from '../../../context/ModalContext';
import { CloseIcon } from '../../Icons';
import AutoResizableTextarea from '../AutoResizableTextarea';
import FormatingHelp from '../FormatingHelp';
import styles from './modalportal.module.css';

interface ModalPortal {
  getList: (value: string) => List;
  getCard: (value: string) => Card;
  updateCardData: (cardId: string, title: string, description: string) => void;
  isAuthorized: boolean;
}

function ModalPortal({
  getCard,
  getList,
  updateCardData,
  isAuthorized,
}: ModalPortal) {
  const ref = useRef();
  const { currentModal, hideModal, isUpdated } = useModal();
  const [mounted, setMounted] = useState(false);
  const [cardData, setCardData] = useState(null);
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [showHelper, setShowHelper] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    ref.current = document.querySelector('#modal');
    setMounted(true);
  }, []);

  useEffect(() => {
    if (currentModal) {
      setCardData(getCard(currentModal));
      window.addEventListener('keydown', onKeyDown);
    } else {
      window.removeEventListener('keydown', onKeyDown);
      setCardData(null);
    }
  }, [currentModal, mounted, isUpdated]);

  const onKeyDown = useCallback((event) => {
    if (event.key === 'Escape') {
      hideModalHandle();
    }
  }, []);

  function changeCardDataHandler(field, value) {
    if (!showAlert) {
      setShowAlert(true);
    }
    setCardData((prevValue) => ({ ...prevValue, [field]: value }));
  }

  function hideModalHandle() {
    if (!isAuthorized) hideModal();

    if (isEditingDesc) {
      if (window.confirm('Do you want to save changes?')) {
        handleUpdateCardData();
        setIsEditingDesc(false);
      }
    }

    if (cardData.name.length === 0) {
      alert(`Card name must not be empty`);
      return;
    }

    hideModal();
  }

  function handleUpdateCardData() {
    if (cardData.name.length === 0) {
      alert(`Card name must not be empty`);
      return;
    }
    updateCardData(cardData.id, cardData.name, cardData.description);
  }

  if (!mounted || !cardData) return null;
  return createPortal(
    <div className={styles.modalWrapper}>
      {showHelper ? (
        <FormatingHelp closeHelperHandler={() => setShowHelper(false)} />
      ) : (
        ''
      )}
      <div className={styles.background} onClick={hideModalHandle} />
      <div className={styles.modalBody}>
        <button
          className={styles.closeButton}
          type="button"
          aria-label="Close"
          onClick={hideModalHandle}>
          <CloseIcon />
        </button>
        <div>
          {isAuthorized ? (
            <AutoResizableTextarea
              textValue={cardData.name}
              placeholder={cardData.name}
              shouldFocus={false}
              onBlur={handleUpdateCardData}
              onChange={(e) => changeCardDataHandler('name', e)}
            />
          ) : (
            <div className={styles.textTitle}>{cardData.name}</div>
          )}

          <small>
            in list <span>{getList(cardData.list).title}</span>
          </small>
        </div>

        <div className={styles.description}>
          <h3>Description</h3>
          {isAuthorized && (
            <button
              className={`${styles.button} ${styles.edit} ${
                isEditingDesc ? styles.hidden : ''
              }`}
              onClick={() => setIsEditingDesc(!isEditingDesc)}>
              Edit
            </button>
          )}

          {isEditingDesc ? (
            <>
              <AutoResizableTextarea
                className={styles.textarea}
                placeholder=""
                shouldFocus={isEditingDesc}
                textValue={cardData.description}
                onChange={(e) => changeCardDataHandler('description', e)}
              />
              <button
                className={`${styles.button} ${styles.save}`}
                onClick={() => {
                  setIsEditingDesc(!isEditingDesc);
                  handleUpdateCardData();
                }}>
                Save
              </button>
              <button
                className={`${styles.button} ${styles.edit}`}
                onClick={() => setShowHelper(!showHelper)}>
                Formatting Help
              </button>
            </>
          ) : (
            <div
              onClick={() =>
                isAuthorized ? setIsEditingDesc(!isEditingDesc) : null
              }
              dangerouslySetInnerHTML={{
                __html: marked(cardData.description ?? ''),
              }}
            />
          )}
        </div>
      </div>
    </div>,
    ref.current,
  );
}
export default ModalPortal;
