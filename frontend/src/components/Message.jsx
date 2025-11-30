import { styles } from '../styles/styles';

const Message = ({ message, authUser }) => {
  const isFromMe = message.senderId === authUser._id;
  const time = new Date(message.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      style={{
        ...styles.messageWrapper,
        justifyContent: isFromMe ? 'flex-end' : 'flex-start',
      }}
    >
      {!isFromMe && (
        <img src={message.profilePic} alt="avatar" style={styles.messageAvatar} />
      )}
      <div
        style={{
          ...styles.messageBubble,
          backgroundColor: isFromMe ? '#3b82f6' : '#374151',
        }}
      >
        <p style={styles.messageText}>{message.message}</p>
        <span style={styles.messageTime}>{time}</span>
      </div>
    </div>
  );
};

export default Message;