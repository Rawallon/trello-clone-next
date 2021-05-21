import { SyntheticEvent, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './addboardmodal.module.css';

interface AddBoardModalProps {
  toggleModal: () => void;
  createBoard: (title: string, bgcolor: string) => void;
  bgOptions: string[];
}

function AddBoardModal({
  toggleModal,
  createBoard,
  bgOptions,
}: AddBoardModalProps) {
  const ref = useRef();
  const [mounted, setMounted] = useState(false);
  const [currentColor, setCurrentColor] = useState(bgOptions[0]);
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    ref.current = document.querySelector('#modal');
    setMounted(true);
  }, []);

  if (!mounted) return null;

  function onChangeHandle(event: SyntheticEvent) {
    setInputText((event.target as HTMLInputElement).value);
  }

  function closeModalHandle() {
    setInputText('');
    toggleModal();
  }

  function createBoardHandle() {
    closeModalHandle();
    createBoard(inputText, currentColor);
  }
  return createPortal(
    <div className={styles.modalWrapper}>
      <div className={styles.modalBodyWrapper} onClick={closeModalHandle}>
        <div className={styles.modalBody} onClick={(e) => e.stopPropagation()}>
          <div className={styles.cardWrapper}>
            <div
              className={styles.fakeCard}
              style={{ backgroundColor: currentColor }}>
              <input
                type="text"
                value={inputText}
                onChange={onChangeHandle}
                placeholder="Add board title"
              />
            </div>
            <div data-testid="color-list" className={styles.colorHolder}>
              {bgOptions.map((color, index) => (
                <div
                  key={index}
                  style={{ backgroundColor: color }}
                  onClick={() => setCurrentColor(color)}></div>
              ))}
            </div>
          </div>
          <div>
            <button onClick={createBoardHandle}>Create board</button>
            <button className={styles.cancelBtn} onClick={closeModalHandle}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>,
    ref.current,
  );
}
export default AddBoardModal;
