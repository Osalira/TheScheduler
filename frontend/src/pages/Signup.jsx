import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Signup.css'; // Optional for styling

function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    try {
      await axios.post('http://localhost:5000/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      navigate('/'); // Redirect to login page after successful signup
    } catch (err) {
      setError('Error creating account. Please try again.');
    }
  };

  return (
    <div className="loginBox">
      <div className="inner">
        <div className="register">
          <div className="top">
            <img className="logo" src="/path/to/logo.jpeg" alt="Logo" />
            <div className="title">Create an Account</div>
            <div className="subtitle">
              Already have an account?{' '}
              <a href="/" className="subtitle-action">
                Sign In
              </a>
            </div>
          </div>
          <form onSubmit={handleSignup}>
            <div className="form">
              <input
                type="text"
                placeholder="Username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w100"
                required
              />
              <input
                type="email"
                placeholder="Email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w100"
                required
              />
              <input
                type="password"
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w100"
                required
              />
              <input
                type="password"
                placeholder="Confirm Password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w100"
                required
              />
            </div>
            <button type="submit" className="action">
              Create Account
            </button>
          </form>
          {error && <p className="error">{error}</p>}
        </div>
      </div>
    </div>
  );
}

export default Signup;
