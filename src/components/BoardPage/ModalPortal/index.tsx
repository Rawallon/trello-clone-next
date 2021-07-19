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
}

function ModalPortal({ getCard, getList, updateCardData }: ModalPortal) {
  const ref = useRef();
  const { currentModal, hideModal } = useModal();
  const [mounted, setMounted] = useState(false);
  const [cardData, setCardData] = useState(null);
  const [editingDesc, setEditingDesc] = useState(false);
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
  }, [currentModal, mounted]);

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
    if (window.confirm('Do you want to save your changes?')) {
      updateCardData(cardData.id, cardData.name, cardData.description);
    }
    hideModal();
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
          <AutoResizableTextarea
            textValue={cardData.name}
            placeholder={cardData.name}
            shouldFocus={false}
            onChange={(e) => changeCardDataHandler('name', e)}
          />
          <small>
            in list <span>{getList(cardData.list).title}</span>
          </small>
        </div>

        <div className={styles.description}>
          <h3>Description</h3>
          <button
            className={`${styles.button} ${styles.edit} ${
              editingDesc ? styles.hidden : ''
            }`}
            onClick={() => setEditingDesc(!editingDesc)}>
            Edit
          </button>

          {editingDesc ? (
            <>
              <AutoResizableTextarea
                className={styles.textarea}
                placeholder=""
                shouldFocus={editingDesc}
                textValue={cardData.description}
                onChange={(e) => changeCardDataHandler('description', e)}
              />
              <button
                className={`${styles.button} ${styles.save}`}
                onClick={() => setEditingDesc(!editingDesc)}>
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
              onClick={() => setEditingDesc(!editingDesc)}
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
