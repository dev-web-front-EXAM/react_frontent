import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState('');
  const { register, currentUser, error, clearError } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  // Clear any errors when unmounting
  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  const validateForm = () => {
    // Reset validation errors
    setValidationError('');

    // Check if passwords match
    if (password !== confirmPassword) {
      setValidationError('Les mots de passe ne correspondent pas.');
      return false;
    }

    // Check password strength (at least 6 characters)
    if (password.length < 6) {
      setValidationError('Le mot de passe doit contenir au moins 6 caractères.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const success = await register(email, password);
      if (success) {
        navigate('/');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-lg border-0 rounded-lg mt-5 fade-in">
            <div className="card-header bg-primary text-white text-center">
              <h3 className="my-3">Maroc Scolarisation</h3>
              <h4 className="mb-0">Inscription</h4>
            </div>
            <div className="card-body p-4">
              {(error || validationError) && (
                <div className="alert alert-danger" role="alert">
                  {validationError || error}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Mot de passe</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                  <div className="form-text">
                    Le mot de passe doit contenir au moins 6 caractères.
                  </div>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">Confirmer le mot de passe</label>
                  <input
                    type="password"
                    className="form-control"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="d-grid gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <FontAwesomeIcon icon={faSpinner} spin className="me-2" />
                        Inscription en cours...
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faUserPlus} className="me-2" />
                        S'inscrire
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
            <div className="card-footer text-center py-3">
              <div className="small">
                <Link to="/login">Déjà un compte? Se connecter!</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register; 