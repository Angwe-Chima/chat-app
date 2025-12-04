import { useState, useEffect, createContext, useContext } from 'react';
import io from 'socket.io-client';
import { useAuthContext } from './AuthContext';

const SocketContext = createContext();

// Export the custom hook
export const useSocketContext = () => {
  return useContext(SocketContext);
};

// Export the provider
export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { authUser } = useAuthContext();

  useEffect(() => {
    if (authUser) {
      const newSocket = io('https://chat-app-gafb.onrender.com', {
        query: {
          userId: authUser._id,
        },
      });

      setSocket(newSocket);

      newSocket.on('getOnlineUsers', (users) => {
        setOnlineUsers(users);
      });

      return () => newSocket.close();
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [authUser]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};