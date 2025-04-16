import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faUserGraduate, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const Header = () => {
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    const toggleMobileMenu = () => {
        setShowMobileMenu(!showMobileMenu);
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) {
            sidebar.classList.toggle('active');
        }
    };

    return (
        <header className="app-header">
            <button className="btn menu-toggle d-md-none me-2" onClick={toggleMobileMenu}>
                <FontAwesomeIcon icon={faBars} />
            </button>

            <div className="d-flex align-items-center">
                <h1 className="me-auto">Maroc Scolarisation</h1>
            </div>

            <div className="ms-auto d-flex align-items-center">
                <div className="dropdown">
                    <button
                        className="btn btn-link text-white dropdown-toggle"
                        type="button"
                        id="userDropdown"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                        <FontAwesomeIcon icon={faUserGraduate} className="me-2" />
                        <span className="d-none d-sm-inline">Admin</span>
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
                            <Link className="dropdown-item" to="/logout">
                                <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
                                Déconnexion
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </header>
    );
};

export default Header; 