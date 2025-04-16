import React from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome, 
  faUserGraduate, 
  faMoneyBillWave, 
  faChartLine, 
  faUsers
} from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <ul className="sidebar-nav">
        <li>
          <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>
            <FontAwesomeIcon icon={faHome} className="me-2" />
            Tableau de bord
          </NavLink>
        </li>
        <li>
          <NavLink to="/students" className={({ isActive }) => isActive ? 'active' : ''}>
            <FontAwesomeIcon icon={faUserGraduate} className="me-2" />
            Gestion des élèves
          </NavLink>
        </li>
        <li>
          <NavLink to="/donors" className={({ isActive }) => isActive ? 'active' : ''}>
            <FontAwesomeIcon icon={faUsers} className="me-2" />
            Donateurs
          </NavLink>
        </li>
        <li>
          <NavLink to="/transactions" className={({ isActive }) => isActive ? 'active' : ''}>
            <FontAwesomeIcon icon={faMoneyBillWave} className="me-2" />
            Transactions
          </NavLink>
        </li>
        <li>
          <NavLink to="/reports" className={({ isActive }) => isActive ? 'active' : ''}>
            <FontAwesomeIcon icon={faChartLine} className="me-2" />
            Rapports
          </NavLink>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar; 