import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, 
  faEdit, 
  faTrash, 
  faFileInvoiceDollar, 
  faFile,
  faDownload
} from '@fortawesome/free-solid-svg-icons';
import { useStudents } from '../../context/StudentContext';

const StudentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getStudent, deleteStudent, getStudentExpenses } = useStudents();
  const [student, setStudent] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const studentData = getStudent(id);
    if (studentData) {
      setStudent(studentData);
      setExpenses(getStudentExpenses(id));
    } else {
      // Student not found, redirect to list
      navigate('/students');
    }
    setLoading(false);
  }, [id, getStudent, getStudentExpenses, navigate]);
  
  // Calculate total expenses
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  // Calculate age
  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const month = today.getMonth() - birth.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };
  
  // Handle student deletion
  const handleDeleteStudent = () => {
    if (window.confirm('Êtes-vous sûr de vouloir archiver cet élève ?')) {
      deleteStudent(parseInt(id));
      navigate('/students');
    }
  };
  
  if (loading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }
  
  if (!student) {
    return (
      <div className="alert alert-danger">
        Élève non trouvé.
      </div>
    );
  }
  
  return (
    <div className="fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Détails de l'élève</h2>
        <Link to="/students" className="btn btn-outline-secondary">
          <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
          Retour à la liste
        </Link>
      </div>
      
      {!student.isActive && (
        <div className="alert alert-warning mb-4">
          <strong>Note:</strong> Cet élève est actuellement archivé.
        </div>
      )}
      
      <div className="card mb-4">
        <div className="card-body">
          <div className="student-profile">
            <div className="text-center">
              <img 
                src={`https://ui-avatars.com/api/?name=${student.firstName}+${student.lastName}&background=random&size=150`} 
                alt={`${student.firstName} ${student.lastName}`}
                className="student-avatar slide-in-left"
              />
            </div>
            
            <div className="student-info">
              <h3 className="mb-1">{student.firstName} {student.lastName}</h3>
              <p className="text-muted mb-3">
                {calculateAge(student.birthDate)} ans | {student.school} | {student.class}
              </p>
              
              <div className="row">
                <div className="col-md-6">
                  <h5>Informations personnelles</h5>
                  <ul className="list-group list-group-flush mb-3">
                    <li className="list-group-item">
                      <strong>Date de naissance:</strong> {new Date(student.birthDate).toLocaleDateString()}
                    </li>
                    <li className="list-group-item">
                      <strong>Besoins spécifiques:</strong> {student.specialNeeds || "Aucun"}
                    </li>
                    <li className="list-group-item">
                      <strong>Parrain/Marraine:</strong> {student.sponsor || "Non attribué"}
                    </li>
                    <li className="list-group-item">
                      <strong>Date d'inscription:</strong> {new Date(student.createdAt).toLocaleDateString()}
                    </li>
                  </ul>
                </div>
                
                <div className="col-md-6">
                  <h5>Contact des parents/tuteurs</h5>
                  <ul className="list-group list-group-flush mb-3">
                    <li className="list-group-item">
                      <strong>Téléphone:</strong> {student.parentContact?.phone}
                    </li>
                    <li className="list-group-item">
                      <strong>Email:</strong> {student.parentContact?.email}
                    </li>
                  </ul>
                </div>
              </div>
              
              {student.isActive && (
                <div className="student-actions">
                  <Link to={`/students/edit/${student.id}`} className="btn btn-warning text-white">
                    <FontAwesomeIcon icon={faEdit} className="me-2" />
                    Modifier
                  </Link>
                  
                  <Link to={`/students/${student.id}/expenses`} className="btn btn-success">
                    <FontAwesomeIcon icon={faFileInvoiceDollar} className="me-2" />
                    Gérer les dépenses
                  </Link>
                  
                  <button className="btn btn-danger" onClick={handleDeleteStudent}>
                    <FontAwesomeIcon icon={faTrash} className="me-2" />
                    Archiver
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="row">
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="card-title mb-0">Documents</h5>
            </div>
            <div className="card-body">
              {student.documents && student.documents.length > 0 ? (
                <ul className="list-group list-group-flush">
                  {student.documents.map(doc => (
                    <li key={doc.id} className="list-group-item d-flex justify-content-between align-items-center">
                      <div>
                        <FontAwesomeIcon icon={faFile} className="me-2 text-primary" />
                        {doc.name}
                      </div>
                      <a href={doc.path} className="btn btn-sm btn-outline-primary" target="_blank" rel="noreferrer">
                        <FontAwesomeIcon icon={faDownload} />
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="alert alert-info">
                  Aucun document n'a été téléchargé pour cet élève.
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">Dépenses récentes</h5>
              <div className="badge bg-primary rounded-pill">
                Total: {totalExpenses} MAD
              </div>
            </div>
            <div className="card-body">
              {expenses.length > 0 ? (
                <ul className="list-group list-group-flush">
                  {expenses.slice(0, 5).map(expense => (
                    <li key={expense.id} className="list-group-item">
                      <div className={`expense-category category-${expense.category === 'Éducation' ? 'education' : expense.category === 'Fourniture scolaire' ? 'supplies' : expense.category === 'Santé' ? 'health' : 'other'}`}>
                        <div className="d-flex justify-content-between">
                          <strong>{expense.category}</strong>
                          <span>{expense.amount} MAD</span>
                        </div>
                        <div className="text-muted small">
                          {expense.description} - {new Date(expense.date).toLocaleDateString()}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="alert alert-info">
                  Aucune dépense n'a été enregistrée pour cet élève.
                </div>
              )}
              
              {expenses.length > 5 && (
                <div className="text-center mt-3">
                  <Link to={`/students/${student.id}/expenses`} className="btn btn-sm btn-outline-primary">
                    Voir toutes les dépenses ({expenses.length})
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetail; 