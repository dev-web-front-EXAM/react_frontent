import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faUserGraduate, faSignOutAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    const toggleMobileMenu = () => {
        setShowMobileMenu(!showMobileMenu);
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) {
            sidebar.classList.toggle('active');
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Failed to log out', error);
        }
    };

    return (
        <header className="app-header">
            <button className="btn menu-toggle d-md-none me-2" onClick={toggleMobileMenu}>
                <FontAwesomeIcon icon={faBars} />
            </button>

            <div className="d-flex align-items-center">
                <img 
                    src="/logo.png" 
                    alt="Maroc Scolarisation" 
                    style={{ height: '40px', marginRight: '10px' }} 
                    onError={(e) => e.target.src = 'https://via.placeholder.com/40?text=MS'}
                />
                <h1 className="me-auto">Maroc Scolarisation</h1>
            </div>

            {currentUser && (
                <div className="ms-auto d-flex align-items-center">
                    <div className="dropdown">
                        <button
                            className="btn btn-link text-white dropdown-toggle"
                            type="button"
                            id="userDropdown"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            <FontAwesomeIcon icon={faUser} className="me-2" />
                            <span className="d-none d-sm-inline">
                                {currentUser.email.split('@')[0]}
                            </span>
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                            <li>
                                <Link className="dropdown-item" to="/profile">
                                    Mon profil
                                </Link>
                            </li>
                            <li>
                                <hr className="dropdown-divider" />
                            </li>
                            <li>
                                <button 
                                    className="dropdown-item"
                                    onClick={handleLogout}
                                >
                                    <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
                                    Déconnexion
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header; 