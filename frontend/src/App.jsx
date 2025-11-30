import { useState } from 'react';
import { AuthProvider, useAuthContext } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <AppContent />
      </SocketProvider>
    </AuthProvider>
  );
}

const AppContent = () => {
  const [showLogin, setShowLogin] = useState(true);
  const { authUser } = useAuthContext();

  if (!authUser) {
    return showLogin ? (
      <Login onSwitchToSignup={() => setShowLogin(false)} />
    ) : (
      <Signup onSwitchToLogin={() => setShowLogin(true)} />
    );
  }

  return <Home />;
};

export default App;