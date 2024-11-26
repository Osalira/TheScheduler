import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css'; // Optional for styling

function Login() {
  const [identifier, setIdentifier] = useState(''); // Username or Email
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', {
        email: identifier,
        password,
      });
      // Save token in localStorage or context
      localStorage.setItem('authToken', response.data.token);
      navigate('/'); // Redirect to the desired page after login
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="loginBox">
      <div className="inner">
        <div className="signIn">
          <div className="top">
            <img className="logo" src="/path/to/logo.jpeg" alt="Logo" />
            <div className="title">Sign In</div>
            <div className="subtitle">
              Don't have an account?{' '}
              <a href="/signup" className="subtitle-action">
                Create Account
              </a>
            </div>
          </div>
          <form onSubmit={handleLogin}>
            <div className="form">
              <input
                type="text"
                className="w100"
                placeholder="Username or Email"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />
              <input
                type="password"
                className="w100"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="action">
              Sign In
            </button>
          </form>
          {error && <p className="error">{error}</p>}
        </div>
      </div>
    </div>
  );
}

export default Login;
