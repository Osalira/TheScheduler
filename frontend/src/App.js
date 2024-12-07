import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Logout from './pages/Logout';
import HomePage from './pages/HomePage'; // Import the HomePage component
import ArchivedWeeksPage from './pages/ArchivedWeeksPage';
import "./index.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/archived-weeks" element={<ArchivedWeeksPage />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
