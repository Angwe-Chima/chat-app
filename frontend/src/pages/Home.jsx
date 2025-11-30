import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import MessageContainer from '../components/MessageContainer';
import { styles } from '../styles/styles';

const Home = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);

  return (
    <div style={styles.homeContainer}>
      <Sidebar
        onSelectConversation={setSelectedConversation}
        selectedConversation={selectedConversation}
      />
      <MessageContainer selectedConversation={selectedConversation} />
    </div>
  );
};

export default Home;