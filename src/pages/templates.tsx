import { getSession, signOut, useSession } from 'next-auth/client';
import { useState } from 'react';

import AddBoardModal from '../components/BoardListing/AddBoardModal';
import ProfileSideBar from '../components/BoardListing/ProfileSideBar';
import TemplateListProps from '../components/BoardListing/TemplateList';

import { Board, useBoard } from '../context/BoardContext';

import styles from '../styles/BoardListing.module.css';

import ApiCall from '../utils/API';
import { sessionReturn } from '../utils/interfaces';

interface apiReturn {
  username: any;
  boards: Board[];
}

export default function BoardListing({ boards }) {
  const [session, loading] = useSession() as unknown as [
    sessionReturn,
    boolean,
  ];
  const { bgOptions, createNewBoardFromTemplate } = useBoard();

  const [isCreateModal, setIsCreateModal] = useState(false);
  const [chosenTemplate, setChosenTemplate] = useState(null);

  function toggleModal() {
    setIsCreateModal(!isCreateModal);
  }

  function createBoardHandle(title, color) {
    createNewBoardFromTemplate(
      title,
      color,
      session.user.userId,
      chosenTemplate,
    );
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
        <TemplateListProps
          templates={boards}
          showModal={toggleModal}
          setTemplateId={setChosenTemplate}
        />
      </div>
    );
  }
}

export async function getServerSideProps(context) {
  const session = (await getSession(context)) as unknown as sessionReturn;
  if (!session) return { props: {} };
  const data: apiReturn = await ApiCall(`/api/boards/templates`);
  return {
    props: { boards: data, session },
  };
}
