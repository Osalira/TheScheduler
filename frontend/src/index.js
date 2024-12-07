import { StrictMode } from 'react';
import React from 'react';
import { createRoot } from 'react-dom/client'; // Use ReactDOM.createRoot for React 18
import App from './App';
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter
import { ApiProvider } from './pages/ApiProvider';

// Get the root element from the HTML
const root = createRoot(document.getElementById('root'));

// Render the app
root.render(
  <StrictMode>
    <BrowserRouter>
      <ApiProvider>
        <App />
      </ApiProvider>
    </BrowserRouter>
  </StrictMode>
);
