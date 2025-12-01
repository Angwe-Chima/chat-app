import { styles } from '../styles/styles';

const Message = ({ message, authUser }) => {
  // Handle both populated and non-populated senderId
  const senderId = message.senderId?._id || message.senderId;
  const isFromMe = senderId === authUser._id;
  
  // Get profile pic from populated sender data
  const senderProfilePic = message.senderId?.profilePic;
  
  const time = new Date(message.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const bubbleStyle = {
    ...styles.messageBubble,
    backgroundColor: isFromMe 
      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      : '#334155',
    background: isFromMe 
      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      : '#334155',
    borderRadius: isFromMe ? '1.125rem 1.125rem 0.25rem 1.125rem' : '1.125rem 1.125rem 1.125rem 0.25rem',
  };

  return (
    <div
      style={{
        ...styles.messageWrapper,
        justifyContent: isFromMe ? 'flex-end' : 'flex-start',
      }}
    >
      {!isFromMe && senderProfilePic && (
        <img src={senderProfilePic} alt="avatar" style={styles.messageAvatar} />
      )}
      <div style={bubbleStyle}>
        <p style={styles.messageText}>{message.message}</p>
        <span style={styles.messageTime}>{time}</span>
      </div>
    </div>
  );
};

export default Message;