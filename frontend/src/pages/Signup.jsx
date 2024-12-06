import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    document.body.classList.add("logout-page");

    return () => {
      // Clean up by removing the class when the component unmounts
      document.body.classList.remove("logout-page");
    };
  }, []);

  const handleSignup = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/register', {
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
    <div className="logoutBox">
      <div className="inner">
        <div className="register">
          <div className="top">
            <img className="logo" src="/assests/sclogo2.png" alt="Logo" />
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
