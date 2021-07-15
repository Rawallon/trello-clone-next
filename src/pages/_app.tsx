if (process.env.NEXT_PUBLIC_API_MOCKING === 'enabled') {
  require('../mocks');
}
import { Provider as NextAuthProvider } from 'next-auth/client';

import { BoardContextProvider } from '../context/BoardContext';
import { CardsContextProvider } from '../context/CardsContext';
import { ListContextProvider } from '../context/ListsContext';
import { ModalContextProvider } from '../context/ModalContext';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <NextAuthProvider session={pageProps.session}>
      <BoardContextProvider>
        <ListContextProvider>
          <CardsContextProvider>
            <ModalContextProvider>
              <Component {...pageProps} />
            </ModalContextProvider>
          </CardsContextProvider>
        </ListContextProvider>
      </BoardContextProvider>
    </NextAuthProvider>
  );
}

export default MyApp;
