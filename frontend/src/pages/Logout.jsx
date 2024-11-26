import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('authToken'); // Clear the token
    navigate('/'); // Redirect to login page
  }, [navigate]);

  return <div>Logging out...</div>;
}

export default Logout;
