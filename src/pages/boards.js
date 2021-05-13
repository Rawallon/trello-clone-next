import { useState } from 'react';
import AddBoardModal from '../components/BoardListing/AddBoardModal';
import BoardsList from '../components/BoardListing/BoardsList';
import ProfileSideBar from '../components/BoardListing/ProfileSideBar';
import styles from '../styles/BoardListing.module.css';

function BoardListing(props) {
  const [isCreateModal, setIsCreateModal] = useState(false);

  function toggleModal() {
    setIsCreateModal(!isCreateModal);
  }
  return (
    <div className={styles.wrapper}>
      {isCreateModal ? <AddBoardModal toggleModal={toggleModal} /> : ''}
      <ProfileSideBar username={'Rawallon Cardoso'} />
      <BoardsList showModal={toggleModal} />
    </div>
  );
}
export default BoardListing;
