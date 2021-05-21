import { createContext, ReactNode, useContext, useState } from 'react';

interface ModalContextData {
  currentModal: string;
  showModal: (cId: string) => void;
  hideModal: () => void;
}

export const ModalContext = createContext({} as ModalContextData);

export function ModalContextProvider({ children }) {
  const [display, setDisplay] = useState(null);

  function showModal(cId: string) {
    setDisplay(cId);
  }

  function hideModal() {
    setDisplay(null);
  }

  return (
    <ModalContext.Provider
      value={{
        currentModal: display,
        showModal,
        hideModal,
      }}>
      {children}
    </ModalContext.Provider>
  );
}

export const useModal = () => {
  return useContext(ModalContext);
};
