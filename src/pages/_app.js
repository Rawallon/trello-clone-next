if (process.env.NEXT_PUBLIC_API_MOCKING === 'enabled') {
  require('../mocks');
}

import { BoardContextProvider } from '../context/BoardContext';
import { CardsContextProvider } from '../context/CardsContext';
import { ListContextProvider } from '../context/ListsContext';
import { ModalContextProvider } from '../context/ModalContext';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <BoardContextProvider>
      <ListContextProvider>
        <CardsContextProvider>
          <ModalContextProvider>
            <Component {...pageProps} />
          </ModalContextProvider>
        </CardsContextProvider>
      </ListContextProvider>
    </BoardContextProvider>
  );
}

export default MyApp;
