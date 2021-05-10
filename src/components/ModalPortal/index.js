import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useModal } from '../../context/ModalContext';
import styles from './modalportal.module.css';

function ModalPortal({ children }) {
  const ref = useRef();
  const [mounted, setMounted] = useState(false);
  const { currentModal, hideModal } = useModal();

  useEffect(() => {
    ref.current = document.querySelector('#modal');
    setMounted(true);
  }, []);

  if (!mounted || !currentModal) return null;
  return createPortal(
    <div className={styles.modalWrapper}>
      <div className={styles.background} onClick={() => hideModal()} />
      <div className={styles.modalBody}>{currentModal}</div>
    </div>,
    ref.current,
  );
}
export default ModalPortal;
