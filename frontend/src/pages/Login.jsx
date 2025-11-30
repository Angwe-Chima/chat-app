import { useState } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import { styles } from '../styles/styles';

const Login = ({ onSwitchToSignup }) => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName, password }),
      });

      // Check if response is ok
      if (!res.ok) {
        let errorMessage = 'Login failed';
        try {
          const errorData = await res.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          errorMessage = `Server error: ${res.status}`;
        }
        throw new Error(errorMessage);
      }

      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      localStorage.setItem('chat-user', JSON.stringify(data));
      setAuthUser(data);
    } catch (error) {
      console.error('Login error:', error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div style={styles.authContainer}>
      <div style={styles.authCard}>
        <h1 style={styles.authTitle}>Login to ChatApp</h1>
        <div style={styles.form}>
          <input
            type="text"
            placeholder="Username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            onKeyPress={handleKeyPress}
            style={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            style={styles.input}
            required
          />
          <button onClick={handleSubmit} disabled={loading} style={styles.button}>
            {loading ? 'Loading...' : 'Login'}
          </button>
        </div>
        <p style={styles.switchText}>
          Don't have an account?{' '}
          <span onClick={onSwitchToSignup} style={styles.link}>
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;