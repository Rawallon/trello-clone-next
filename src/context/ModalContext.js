import { createContext, useContext, useState } from 'react';

export const ModalContext = createContext({});

export function ModalContextProvider({ children }) {
  const [display, setDisplay] = useState(null);

  function showModal(cId) {
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
