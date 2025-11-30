import { useState, useEffect, useRef } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import { useSocketContext } from '../contexts/SocketContext';
import Message from './Message';
import { styles } from '../styles/styles';

const MessageContainer = ({ selectedConversation }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const { authUser } = useAuthContext();
  const { socket } = useSocketContext();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedConversation) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/message/${selectedConversation._id}`);
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setMessages(data);
      } catch (error) {
        alert(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [selectedConversation]);

  useEffect(() => {
    socket?.on('newMessage', (newMessage) => {
      if (newMessage.senderId === selectedConversation?._id) {
        setMessages((prev) => [...prev, newMessage]);
      }
    });

    return () => socket?.off('newMessage');
  }, [socket, selectedConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!messageInput.trim()) return;

    setSending(true);
    try {
      const res = await fetch(`/api/message/send/${selectedConversation._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageInput }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setMessages([...messages, data]);
      setMessageInput('');
    } catch (error) {
      alert(error.message);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!selectedConversation) {
    return (
      <div style={styles.noChat}>
        <h2 style={styles.noChatTitle}>Welcome {authUser.fullName} 👋</h2>
        <p style={styles.noChatText}>Select a chat to start messaging</p>
      </div>
    );
  }

  return (
    <div style={styles.messageContainer}>
      <div style={styles.messageHeader}>
        <img
          src={selectedConversation.profilePic}
          alt="avatar"
          style={styles.headerAvatar}
        />
        <span style={styles.headerName}>{selectedConversation.fullName}</span>
      </div>

      <div style={styles.messagesArea}>
        {loading ? (
          <div style={styles.loadingContainer}>Loading messages...</div>
        ) : (
          <>
            {messages.map((message) => (
              <Message key={message._id} message={message} authUser={authUser} />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <div style={styles.messageForm}>
        <input
          type="text"
          placeholder="Type a message..."
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyPress={handleKeyPress}
          style={styles.messageInput}
        />
        <button onClick={handleSend} disabled={sending} style={styles.sendButton}>
          {sending ? '...' : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default MessageContainer;