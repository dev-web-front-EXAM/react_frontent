import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Layout Components
import AppLayout from './components/layout/AppLayout';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import PrivateRoute from './components/auth/PrivateRoute';

// Main Components
import Dashboard from './components/Dashboard';
import StudentList from './components/students/StudentList';
import StudentForm from './components/students/StudentForm';
import StudentDetail from './components/students/StudentDetail';
import StudentExpenses from './components/students/StudentExpenses';
import { useAuth } from './context/AuthContext';

function App() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    // Show a loading spinner while checking auth state
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/students" element={<StudentList />} />
            <Route path="/students/add" element={<StudentForm />} />
            <Route path="/students/edit/:id" element={<StudentForm />} />
            <Route path="/students/:id" element={<StudentDetail />} />
            <Route path="/students/:id/expenses" element={<StudentExpenses />} />
          </Route>
        </Route>

        {/* Redirect all other routes to login or home based on auth status */}
        <Route path="*" element={currentUser ? <Navigate to="/" /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
