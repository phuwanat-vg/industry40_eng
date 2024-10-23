// src/components/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import './Login.css'; // Import the CSS file for styles
import logo from './images/logo.png'; // Path to your logo
import login_cover from './images/login_cover.png';
import { useAuth } from '../AuthContext'; // Import the Auth context

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setIsLoggedIn } = useAuth(); // Use Auth context

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsLoggedIn(true); // Update the logged-in state
      navigate('/monitor'); // Redirect to monitor after successful login
    } catch (err) {
      setError('Login failed. Please check your credentials.');
      console.error('Login error:', err);
    }
  };

  const handleRegisterRedirect = () => {
    navigate('/register');
  };

  return (
    <div className="login-container">
      <div className="left-image">
        <img src={login_cover} alt="login_cover" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'cover' }} />
      </div>
      <div className="right-content">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-control"
            />
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button type="submit" className="btn btn-primary">Login</button>
        </form>
        {/* Register Button */}
        <button onClick={handleRegisterRedirect} className="btn btn-link" style={{ marginTop: '10px' }}>
          Register
        </button>
      </div>
    </div>
  );
}

export default Login;
