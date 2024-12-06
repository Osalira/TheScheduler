// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import {DndContext} from '@dnd-kit/core';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Logout from './pages/Logout';
import HomePage from './pages/HomePage'; // Import the HomePage component
import "./index.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
<link
  href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css"
  rel="stylesheet"
/> 

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/home" element={<DndContext> <HomePage /></DndContext>}/>
      <Route path="/logout" element={<Logout />} />
      <Route path="*" element={<Navigate to="/" />} />
    
    </Routes>
    </Router>
  );
}

export default App;

