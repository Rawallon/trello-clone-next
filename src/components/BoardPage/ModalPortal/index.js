import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useModal } from '../../../context/ModalContext';
import marked from 'marked';
import AutoResizableTextarea from '../AutoResizableTextarea';
import { CloseIcon } from '../../Icons';
import styles from './modalportal.module.css';
import FormatingHelp from '../FormatingHelp';

// TODO: Esc closes modal and formatHelp
// TODO: Alert if user is editing and clicks away
function ModalPortal({ getCard, getList, updateCardData }) {
  const ref = useRef();
  const { currentModal, hideModal } = useModal();
  const [mounted, setMounted] = useState(false);
  const [cardData, setCardData] = useState([]);
  const [editingDesc, setEditingDesc] = useState(false);
  const [showHelper, setShowHelper] = useState(false);
  useEffect(() => {
    ref.current = document.querySelector('#modal');
    setMounted(true);
  }, []);
  useEffect(() => {
    setCardData(getCard(currentModal));
  }, [currentModal]);

  function changeCardDataHandler(field, value) {
    setCardData((prevValue) => ({ ...prevValue, [field]: value }));
  }

  function hideModalHandle() {
    setEditingDesc(false);
    hideModal();
    updateCardData(cardData);
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
                __html: marked(cardData.description),
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
