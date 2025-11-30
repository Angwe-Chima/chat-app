import { useState } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import { styles } from '../styles/styles.js';

const Signup = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    userName: '',
    password: '',
    confirmPassword: '',
    gender: 'male',
  });
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();

  const handleSubmit = async () => {
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      // Check if response is ok
      if (!res.ok) {
        // Try to parse error message
        let errorMessage = 'Signup failed';
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
      console.error('Signup error:', error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.authContainer}>
      <div style={styles.authCard}>
        <h1 style={styles.authTitle}>Sign Up for ChatApp</h1>
        <div style={styles.form}>
          <input
            type="text"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            style={styles.input}
            required
          />
          <input
            type="text"
            placeholder="Username"
            value={formData.userName}
            onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
            style={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            style={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            style={styles.input}
            required
          />
          <div style={styles.genderContainer}>
            <label style={styles.genderLabel}>
              <input
                type="radio"
                value="male"
                checked={formData.gender === 'male'}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              />
              Male
            </label>
            <label style={styles.genderLabel}>
              <input
                type="radio"
                value="female"
                checked={formData.gender === 'female'}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              />
              Female
            </label>
          </div>
          <button onClick={handleSubmit} disabled={loading} style={styles.button}>
            {loading ? 'Loading...' : 'Sign Up'}
          </button>
        </div>
        <p style={styles.switchText}>
          Already have an account?{' '}
          <span onClick={onSwitchToLogin} style={styles.link}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;