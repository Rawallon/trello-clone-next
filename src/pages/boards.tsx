import { getSession, useSession } from 'next-auth/client';
import { useEffect, useState } from 'react';
import AddBoardModal from '../components/BoardListing/AddBoardModal';
import BoardsList from '../components/BoardListing/BoardsList';
import ProfileSideBar from '../components/BoardListing/ProfileSideBar';
import { Board, useBoard } from '../context/BoardContext';
import styles from '../styles/BoardListing.module.css';
import ApiCall from '../utils/API';

interface apiReturn {
  username: any;
  boards: Board[];
}

interface sessionReturn {
  user: {
    userId: string;
    image: string;
    name: string;
  };
}

export default function BoardListing({ boards }) {
  const [session, loading] = useSession();

  const { bgOptions, myBoards, putMyBoards, createNewBoard } = useBoard();
  const [isCreateModal, setIsCreateModal] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      putMyBoards(boards);
    }
  }, [boards]);

  function toggleModal() {
    setIsCreateModal(!isCreateModal);
  }

  function createBoardHandle(title, color) {
    createNewBoard(title, color, session.user.userId);
  }

  if (typeof window !== 'undefined' && loading) return null;
  if (session) {
    return (
      <div className={styles.wrapper}>
        {isCreateModal ? (
          <AddBoardModal
            bgOptions={bgOptions}
            toggleModal={toggleModal}
            createBoard={createBoardHandle}
          />
        ) : (
          ''
        )}
        <ProfileSideBar
          username={session.user.name}
          picture={session.user.image}
        />
        <BoardsList boards={myBoards} showModal={toggleModal} />
      </div>
    );
  }
}

export async function getServerSideProps(context) {
  const session = (await getSession(context)) as unknown as sessionReturn;
  const data: apiReturn = await ApiCall(
    `http://localhost:3000/api/boards?userid=${session.user.userId}`,
  );
  return {
    props: { boards: data, session },
  };
}
