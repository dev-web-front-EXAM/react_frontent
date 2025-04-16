import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PrivateRoute = () => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    // Show a loading spinner if auth state is still being determined
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login page, otherwise render the protected route
  return currentUser ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute; 