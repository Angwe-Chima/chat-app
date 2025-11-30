import { styles } from '../styles/styles';

const Conversation = ({ conversation, onSelect, isSelected, isOnline }) => {
  return (
    <div
      onClick={() => onSelect(conversation)}
      style={{
        ...styles.conversation,
        backgroundColor: isSelected ? '#3b82f6' : 'transparent',
      }}
    >
      <div style={styles.avatarContainer}>
        <img src={conversation.profilePic} alt="avatar" style={styles.avatar} />
        {isOnline && <div style={styles.onlineBadge} />}
      </div>
      <div style={styles.conversationInfo}>
        <p style={styles.conversationName}>{conversation.fullName}</p>
      </div>
    </div>
  );
};

export default Conversation;