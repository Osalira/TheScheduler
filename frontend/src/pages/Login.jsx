import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add('login-page');
    return () => {
      document.body.classList.remove('login-page');
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!identifier || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/login',{
        identifier,
        password,
      });
      localStorage.setItem('authToken', response.data.access_token);
      localStorage.setItem('refreshToken', response.data.refresh_token);
      navigate('/home');
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError('Invalid credentials. Please try again.');
      } else {
        setError('Something went wrong. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  
  };

  return (
    <div className="loginBox">
      <div className="inner">
        <div className="signIn">
          <div className="top">
            <img className="logo" src="/assests/sclogo2.png" alt="Logo" />
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
              <label htmlFor="identifier">Username or Email</label>
              <input
                id="identifier"
                type="text"
                className="w100"
                placeholder="Username or Email"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                className="w100"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="action" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
          {error && <p className="error">{error}</p>}
        </div>
      </div>
    </div>
  );
}

export default Login;
