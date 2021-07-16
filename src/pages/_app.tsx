if (process.env.NEXT_PUBLIC_API_MOCKING === 'enabled') {
  require('../mocks');
}
import { Provider as NextAuthProvider } from 'next-auth/client';
import HeadNext from 'next/head';

import { BoardContextProvider } from '../context/BoardContext';
import { CardsContextProvider } from '../context/CardsContext';
import { ListContextProvider } from '../context/ListsContext';
import { ModalContextProvider } from '../context/ModalContext';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <HeadNext>
        <title>Nello</title>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#0079bf" />
        <meta name="apple-mobile-web-app-title" content="Nello" />
        <meta name="application-name" content="Nello" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
      </HeadNext>
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
