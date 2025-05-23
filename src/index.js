import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { StudentProvider } from './context/StudentContext';
import { AuthProvider } from './context/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <StudentProvider>
        <App />
      </StudentProvider>
    </AuthProvider>
  </React.StrictMode>
);
