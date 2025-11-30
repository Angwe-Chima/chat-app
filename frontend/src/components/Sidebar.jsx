import { useState, useEffect } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import { useSocketContext } from '../contexts/SocketContext';
import Conversation from './Conversation';
import { styles } from '../styles/styles';

const Sidebar = ({ onSelectConversation, selectedConversation }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const { authUser, setAuthUser } = useAuthContext();
  const { onlineUsers } = useSocketContext();

  useEffect(() => {
    const getConversations = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/users');
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setConversations(data);
      } catch (error) {
        alert(error.message);
      } finally {
        setLoading(false);
      }
    };

    getConversations();
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      localStorage.removeItem('chat-user');
      setAuthUser(null);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div style={styles.sidebar}>
      <div style={styles.sidebarHeader}>
        <h2 style={styles.sidebarTitle}>Chats</h2>
        <button onClick={handleLogout} style={styles.logoutButton}>
          Logout
        </button>
      </div>

      <div style={styles.conversationsList}>
        {loading ? (
          <div style={styles.loadingContainer}>Loading...</div>
        ) : (
          conversations.map((conversation) => (
            <Conversation
              key={conversation._id}
              conversation={conversation}
              onSelect={onSelectConversation}
              isSelected={selectedConversation?._id === conversation._id}
              isOnline={onlineUsers.includes(conversation._id)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Sidebar;