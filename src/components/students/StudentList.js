import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, 
  faEdit, 
  faTrash, 
  faEye, 
  faFileInvoiceDollar, 
  faUndo,
  faSearch,
  faSort,
  faSortUp,
  faSortDown
} from '@fortawesome/free-solid-svg-icons';
import { useStudents } from '../../context/StudentContext';

const StudentList = () => {
  const { students, deleteStudent, restoreStudent } = useStudents();
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('active');
  const [sortConfig, setSortConfig] = useState({ key: 'lastName', direction: 'ascending' });
  
  // Apply filters and sorting
  useEffect(() => {
    let result = [...students];
    
    // Filter by status
    if (statusFilter === 'active') {
      result = result.filter(student => student.isActive);
    } else if (statusFilter === 'inactive') {
      result = result.filter(student => !student.isActive);
    }
    
    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(student => 
        student.firstName.toLowerCase().includes(term) || 
        student.lastName.toLowerCase().includes(term) ||
        student.school.toLowerCase().includes(term) ||
        student.class.toLowerCase().includes(term)
      );
    }
    
    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    
    setFilteredStudents(result);
  }, [students, searchTerm, statusFilter, sortConfig]);
  
  // Handle sorting
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  // Get sort icon
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <FontAwesomeIcon icon={faSort} />;
    }
    return sortConfig.direction === 'ascending' 
      ? <FontAwesomeIcon icon={faSortUp} /> 
      : <FontAwesomeIcon icon={faSortDown} />;
  };
  
  // Handle student deletion (logical delete)
  const handleDeleteStudent = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir archiver cet élève ?')) {
      deleteStudent(id);
    }
  };
  
  // Handle student restoration
  const handleRestoreStudent = (id) => {
    restoreStudent(id);
  };
  
  return (
    <div className="fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestion des élèves</h2>
        <Link to="/students/add" className="btn btn-primary">
          <FontAwesomeIcon icon={faPlus} className="me-2" />
          Ajouter un élève
        </Link>
      </div>
      
      <div className="card mb-4">
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text">
                  <FontAwesomeIcon icon={faSearch} />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Rechercher un élève..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="btn-group float-md-end">
                <button 
                  className={`btn ${statusFilter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setStatusFilter('all')}
                >
                  Tous
                </button>
                <button 
                  className={`btn ${statusFilter === 'active' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setStatusFilter('active')}
                >
                  Actifs
                </button>
                <button 
                  className={`btn ${statusFilter === 'inactive' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setStatusFilter('inactive')}
                >
                  Archivés
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="table-responsive">
        <table className="table table-striped data-table">
          <thead>
            <tr>
              <th onClick={() => requestSort('lastName')} style={{ cursor: 'pointer' }}>
                Nom {getSortIcon('lastName')}
              </th>
              <th onClick={() => requestSort('firstName')} style={{ cursor: 'pointer' }}>
                Prénom {getSortIcon('firstName')}
              </th>
              <th onClick={() => requestSort('birthDate')} style={{ cursor: 'pointer' }}>
                Date de naissance {getSortIcon('birthDate')}
              </th>
              <th onClick={() => requestSort('school')} style={{ cursor: 'pointer' }}>
                École {getSortIcon('school')}
              </th>
              <th onClick={() => requestSort('class')} style={{ cursor: 'pointer' }}>
                Classe {getSortIcon('class')}
              </th>
              <th>Parrain/Marraine</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map(student => (
                <tr key={student.id} className={!student.isActive ? 'table-secondary' : ''}>
                  <td>{student.lastName}</td>
                  <td>{student.firstName}</td>
                  <td>{new Date(student.birthDate).toLocaleDateString()}</td>
                  <td>{student.school}</td>
                  <td>{student.class}</td>
                  <td>{student.sponsor || <span className="text-muted">Non attribué</span>}</td>
                  <td>
                    <div className="d-flex gap-1">
                      <Link to={`/students/${student.id}`} className="btn btn-sm btn-info text-white">
                        <FontAwesomeIcon icon={faEye} />
                      </Link>
                      
                      {student.isActive ? (
                        <>
                          <Link to={`/students/edit/${student.id}`} className="btn btn-sm btn-warning text-white">
                            <FontAwesomeIcon icon={faEdit} />
                          </Link>
                          
                          <Link to={`/students/${student.id}/expenses`} className="btn btn-sm btn-success">
                            <FontAwesomeIcon icon={faFileInvoiceDollar} />
                          </Link>
                          
                          <button 
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDeleteStudent(student.id)}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </>
                      ) : (
                        <button 
                          className="btn btn-sm btn-success"
                          onClick={() => handleRestoreStudent(student.id)}
                        >
                          <FontAwesomeIcon icon={faUndo} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  <div className="alert alert-info mb-0">
                    {searchTerm 
                      ? "Aucun élève ne correspond à votre recherche." 
                      : statusFilter === 'active' 
                        ? "Aucun élève actif." 
                        : statusFilter === 'inactive' 
                          ? "Aucun élève archivé." 
                          : "Aucun élève."}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {filteredStudents.length > 0 && (
        <div className="card mt-3">
          <div className="card-body text-muted small">
            Affichage de {filteredStudents.length} élève(s) sur {students.length}.
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentList; 