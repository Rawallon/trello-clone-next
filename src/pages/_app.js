import { CardsContextProvider } from '../context/CardsContext';
import { ListContextProvider } from '../context/ListsContext';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <ListContextProvider>
      <CardsContextProvider>
        <Component {...pageProps} />
      </CardsContextProvider>
    </ListContextProvider>
  );
}

export default MyApp;
