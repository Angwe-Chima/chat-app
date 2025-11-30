import { useState, createContext, useContext } from 'react';

const AuthContext = createContext();

// Export the custom hook
export const useAuthContext = () => {
  return useContext(AuthContext);
};

// Export the provider
export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(
    JSON.parse(localStorage.getItem('chat-user')) || null
  );

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser }}>
      {children}
    </AuthContext.Provider>
  );
};