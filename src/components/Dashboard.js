import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUserGraduate, 
  faUsers, 
  faMoneyBillWave, 
  faChartLine 
} from '@fortawesome/free-solid-svg-icons';

const Dashboard = () => {
  return (
    <div className="fade-in">
      <h2 className="mb-4">Tableau de bord</h2>
      
      <div className="row g-4">
        <div className="col-md-6 col-lg-3">
          <div className="card dashboard-card bg-primary text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="card-title">Élèves</h5>
                  <h3 className="mb-0">125</h3>
                </div>
                <FontAwesomeIcon icon={faUserGraduate} size="3x" opacity="0.6" />
              </div>
              <Link to="/students" className="btn btn-light btn-sm mt-3">Voir tous</Link>
            </div>
          </div>
        </div>
        
        <div className="col-md-6 col-lg-3">
          <div className="card dashboard-card bg-success text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="card-title">Donateurs</h5>
                  <h3 className="mb-0">47</h3>
                </div>
                <FontAwesomeIcon icon={faUsers} size="3x" opacity="0.6" />
              </div>
              <Link to="/donors" className="btn btn-light btn-sm mt-3">Voir tous</Link>
            </div>
          </div>
        </div>
        
        <div className="col-md-6 col-lg-3">
          <div className="card dashboard-card bg-warning text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="card-title">Transactions</h5>
                  <h3 className="mb-0">214</h3>
                </div>
                <FontAwesomeIcon icon={faMoneyBillWave} size="3x" opacity="0.6" />
              </div>
              <Link to="/transactions" className="btn btn-light btn-sm mt-3">Voir tous</Link>
            </div>
          </div>
        </div>
        
        <div className="col-md-6 col-lg-3">
          <div className="card dashboard-card bg-danger text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="card-title">Rapports</h5>
                  <h3 className="mb-0">12</h3>
                </div>
                <FontAwesomeIcon icon={faChartLine} size="3x" opacity="0.6" />
              </div>
              <Link to="/reports" className="btn btn-light btn-sm mt-3">Voir tous</Link>
            </div>
          </div>
        </div>
      </div>
      
      <div className="row mt-4">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h5 className="card-title mb-0">Activités récentes</h5>
            </div>
            <div className="card-body">
              <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <strong>Nouvel élève ajouté</strong>
                    <div className="text-muted small">Karim Benali</div>
                  </div>
                  <span className="text-muted small">Il y a 2 heures</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <strong>Nouvelle transaction</strong>
                    <div className="text-muted small">Don de 500 MAD par Ahmed Tazi</div>
                  </div>
                  <span className="text-muted small">Il y a 5 heures</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <strong>Mise à jour du profil</strong>
                    <div className="text-muted small">Mise à jour des informations de Leila Kadiri</div>
                  </div>
                  <span className="text-muted small">Hier</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <strong>Dépense enregistrée</strong>
                    <div className="text-muted small">300 MAD pour des fournitures scolaires</div>
                  </div>
                  <span className="text-muted small">Il y a 2 jours</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card">
            <div className="card-header bg-success text-white">
              <h5 className="card-title mb-0">Rappels</h5>
            </div>
            <div className="card-body">
              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  <strong>Réunion avec les donateurs</strong>
                  <div className="text-muted small">15 mai à 14h00</div>
                </li>
                <li className="list-group-item">
                  <strong>Visite à l'école Ibn Sina</strong>
                  <div className="text-muted small">18 mai à 10h00</div>
                </li>
                <li className="list-group-item">
                  <strong>Échéance rapport trimestriel</strong>
                  <div className="text-muted small">30 mai</div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 