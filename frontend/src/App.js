// src/App.js
import React from 'react';
import {DndContext} from '@dnd-kit/core';
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
    <DndContext>
      <HomePage />
    </DndContext>
  );
}

export default App;
