import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  auth, 
  logInWithEmailAndPassword, 
  registerWithEmailAndPassword,
  logOut,
  onAuthStateChangedListener
} from '../firebase/firebase';

// Create the context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Login function
  const login = async (email, password) => {
    setError('');
    try {
      await logInWithEmailAndPassword(email, password);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  // Register function
  const register = async (email, password) => {
    setError('');
    try {
      await registerWithEmailAndPassword(email, password);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  // Logout function
  const logout = async () => {
    setError('');
    try {
      await logOut();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  // Clear errors
  const clearError = () => {
    setError('');
  };

  // Context value to expose
  const value = {
    currentUser,
    login,
    register,
    logout,
    error,
    clearError,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 