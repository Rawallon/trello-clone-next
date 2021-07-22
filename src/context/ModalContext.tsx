import { createContext, ReactNode, useContext, useState } from 'react';

interface ModalContextData {
  currentModal: string;
  showModal: (cId: string) => void;
  hideModal: () => void;
  isUpdated: boolean;
  forceModalRefresh: () => void;
}

export const ModalContext = createContext({} as ModalContextData);

export function ModalContextProvider({ children }) {
  const [display, setDisplay] = useState(null);
  const [isUpdated, setIsUpdated] = useState(false);
  function showModal(cId: string) {
    setDisplay(cId);
  }

  function hideModal() {
    setDisplay(null);
  }

  function forceModalRefresh() {
    setIsUpdated((oldValue) => !oldValue);
  }

  return (
    <ModalContext.Provider
      value={{
        currentModal: display,
        showModal,
        hideModal,
        isUpdated,
        forceModalRefresh,
      }}>
      {children}
    </ModalContext.Provider>
  );
}

export const useModal = () => {
  return useContext(ModalContext);
};
