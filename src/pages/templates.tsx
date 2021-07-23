import { getSession, signOut, useSession } from 'next-auth/client';
import { useEffect, useState } from 'react';
import AddBoardModal from '../components/BoardListing/AddBoardModal';
import BoardsList from '../components/BoardListing/BoardsList';
import ProfileSideBar from '../components/BoardListing/ProfileSideBar';
import { Board, useBoard } from '../context/BoardContext';
import styles from '../styles/BoardListing.module.css';
import ApiCall from '../utils/API';
import { sessionReturn } from '../utils/interfaces';

interface apiReturn {
  username: any;
  boards: Board[];
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

  async function makeTemplateCall(username) {
    const retApi = await ApiCall(`/api/boards/templates`, 'POST', {
      title: 'My Template',
      bgColor: 'rgb(210, 144, 52)',
      templateId: 'template-0',
      isPublic: false,
    });
    console.log(retApi);
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
          signOut={signOut}
        />
        <button onClick={makeTemplateCall}>Click</button>
      </div>
    );
  }
}

export async function getServerSideProps(context) {
  const session = (await getSession(context)) as unknown as sessionReturn;
  if (!session) return { props: {} };
  const data: apiReturn = await ApiCall(
    `http://localhost:3000/api/boards?userid=${session.user.userId}`,
  );
  return {
    props: { boards: data, session },
  };
}
