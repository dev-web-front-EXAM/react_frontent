import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faArrowLeft, faUpload, faTimes } from '@fortawesome/free-solid-svg-icons';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useStudents } from '../../context/StudentContext';

const StudentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addStudent, updateStudent, getStudent } = useStudents();
  const [formError, setFormError] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    birthDate: null,
    school: '',
    class: '',
    parentPhone: '',
    parentEmail: '',
    specialNeeds: '',
    sponsor: '',
    documents: []
  });
  
  // Validation errors
  const [errors, setErrors] = useState({});
  
  // Load student data if editing
  useEffect(() => {
    if (id) {
      const student = getStudent(id);
      if (student) {
        setFormData({
          firstName: student.firstName,
          lastName: student.lastName,
          birthDate: new Date(student.birthDate),
          school: student.school,
          class: student.class,
          parentPhone: student.parentContact.phone,
          parentEmail: student.parentContact.email,
          specialNeeds: student.specialNeeds || '',
          sponsor: student.sponsor || '',
          documents: student.documents || []
        });
      } else {
        // Handle case where student is not found
        navigate('/students');
      }
    }
  }, [id, getStudent, navigate]);
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  // Handle date changes
  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      birthDate: date
    }));
    
    // Clear error for this field if it exists
    if (errors.birthDate) {
      setErrors(prev => ({
        ...prev,
        birthDate: null
      }));
    }
  };
  
  // Handle file upload
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    
    // Create file previews
    const newFiles = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      file: file,
      preview: URL.createObjectURL(file)
    }));
    
    setUploadedFiles(prev => [...prev, ...newFiles]);
  };
  
  // Remove uploaded file
  const handleRemoveFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    // Required fields
    if (!formData.firstName.trim()) newErrors.firstName = "Le prénom est requis";
    if (!formData.lastName.trim()) newErrors.lastName = "Le nom est requis";
    if (!formData.birthDate) newErrors.birthDate = "La date de naissance est requise";
    if (!formData.school.trim()) newErrors.school = "L'école est requise";
    if (!formData.class.trim()) newErrors.class = "La classe est requise";
    if (!formData.parentPhone.trim()) newErrors.parentPhone = "Le numéro de téléphone est requis";
    if (!formData.parentEmail.trim()) newErrors.parentEmail = "L'email est requis";
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.parentEmail && !emailRegex.test(formData.parentEmail)) {
      newErrors.parentEmail = "Format d'email invalide";
    }
    
    // Phone validation (assuming Moroccan format)
    const phoneRegex = /^0[567][0-9]{8}$/;
    if (formData.parentPhone && !phoneRegex.test(formData.parentPhone)) {
      newErrors.parentPhone = "Format de téléphone invalide (ex: 0612345678)";
    }
    
    // Age validation (must be under 18)
    if (formData.birthDate) {
      const today = new Date();
      const birthDate = new Date(formData.birthDate);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      if (age >= 18) {
        newErrors.birthDate = "L'élève doit avoir moins de 18 ans";
      }
      
      // Cannot be born in the future
      if (birthDate > today) {
        newErrors.birthDate = "La date de naissance ne peut pas être future";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      setFormError("Veuillez corriger les erreurs du formulaire.");
      // Scroll to first error
      const firstError = document.querySelector('.is-invalid');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    try {
      // Prepare student data
      const studentData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        birthDate: formData.birthDate.toISOString().slice(0, 10),
        school: formData.school,
        class: formData.class,
        parentContact: {
          phone: formData.parentPhone,
          email: formData.parentEmail
        },
        specialNeeds: formData.specialNeeds,
        sponsor: formData.sponsor || null,

        documents: formData.documents.concat(
          uploadedFiles.map(file => ({
            id: file.id,
            name: file.name,
            path: file.preview
          }))
        )
      };
      
      if (id) {
        // Update existing student
        updateStudent(parseInt(id), studentData);
      } else {
        // Add new student
        addStudent(studentData);
      }
      
      // Navigate back to student list
      navigate('/students');
    } catch (error) {
      setFormError("Une erreur est survenue lors de l'enregistrement.");
      console.error("Form submission error:", error);
    }
  };
  
  return (
    <div className="fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>{id ? 'Modifier un élève' : 'Ajouter un élève'}</h2>
        <Link to="/students" className="btn btn-outline-secondary">
          <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
          Retour à la liste
        </Link>
      </div>
      
      {formError && (
        <div className="alert alert-danger mb-4">
          {formError}
        </div>
      )}
      
      <div className="card form-card">
        <form onSubmit={handleSubmit}>
          <h4 className="form-title">Informations personnelles</h4>
          
          <div className="row mb-3">
            <div className="col-md-6">
              <label htmlFor="lastName" className="form-label required-field">Nom</label>
              <input
                type="text"
                className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
              {errors.lastName && (
                <div className="invalid-feedback">{errors.lastName}</div>
              )}
            </div>
            
            <div className="col-md-6">
              <label htmlFor="firstName" className="form-label required-field">Prénom</label>
              <input
                type="text"
                className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
              {errors.firstName && (
                <div className="invalid-feedback">{errors.firstName}</div>
              )}
            </div>
          </div>
          
          <div className="row mb-3">
            <div className="col-md-6">
              <label htmlFor="birthDate" className="form-label required-field">Date de naissance</label>
              <DatePicker
                selected={formData.birthDate}
                onChange={handleDateChange}
                className={`form-control ${errors.birthDate ? 'is-invalid' : ''}`}
                dateFormat="dd/MM/yyyy"
                showYearDropdown
                yearDropdownItemNumber={20}
                scrollableYearDropdown
                maxDate={new Date()}
                id="birthDate"
              />
              {errors.birthDate && (
                <div className="invalid-feedback d-block">{errors.birthDate}</div>
              )}
            </div>
            
            <div className="col-md-6">
              <label htmlFor="sponsor" className="form-label">Parrain/Marraine</label>
              <input
                type="text"
                className="form-control"
                id="sponsor"
                name="sponsor"
                value={formData.sponsor}
                onChange={handleChange}
              />
              <small className="text-muted">Laissez vide si non attribué</small>
            </div>
          </div>
          
          <h4 className="form-title mt-4">Informations scolaires</h4>
          
          <div className="row mb-3">
            <div className="col-md-6">
              <label htmlFor="school" className="form-label required-field">École</label>
              <input
                type="text"
                className={`form-control ${errors.school ? 'is-invalid' : ''}`}
                id="school"
                name="school"
                value={formData.school}
                onChange={handleChange}
              />
              {errors.school && (
                <div className="invalid-feedback">{errors.school}</div>
              )}
            </div>
            
            <div className="col-md-6">
              <label htmlFor="class" className="form-label required-field">Classe</label>
              <input
                type="text"
                className={`form-control ${errors.class ? 'is-invalid' : ''}`}
                id="class"
                name="class"
                value={formData.class}
                onChange={handleChange}
              />
              {errors.class && (
                <div className="invalid-feedback">{errors.class}</div>
              )}
            </div>
          </div>
          
          <div className="mb-3">
            <label htmlFor="specialNeeds" className="form-label">Besoins spécifiques</label>
            <textarea
              className="form-control"
              id="specialNeeds"
              name="specialNeeds"
              rows="3"
              value={formData.specialNeeds}
              onChange={handleChange}
            ></textarea>
          </div>
          
          <h4 className="form-title mt-4">Contact des parents/tuteurs</h4>
          
          <div className="row mb-3">
            <div className="col-md-6">
              <label htmlFor="parentPhone" className="form-label required-field">Téléphone</label>
              <input
                type="text"
                className={`form-control ${errors.parentPhone ? 'is-invalid' : ''}`}
                id="parentPhone"
                name="parentPhone"
                value={formData.parentPhone}
                onChange={handleChange}
                placeholder="0612345678"
              />
              {errors.parentPhone && (
                <div className="invalid-feedback">{errors.parentPhone}</div>
              )}
            </div>
            
            <div className="col-md-6">
              <label htmlFor="parentEmail" className="form-label required-field">Email</label>
              <input
                type="email"
                className={`form-control ${errors.parentEmail ? 'is-invalid' : ''}`}
                id="parentEmail"
                name="parentEmail"
                value={formData.parentEmail}
                onChange={handleChange}
              />
              {errors.parentEmail && (
                <div className="invalid-feedback">{errors.parentEmail}</div>
              )}
            </div>
          </div>
          
          <h4 className="form-title mt-4">Documents</h4>
          
          <div className="file-upload-container">
            <input
              type="file"
              id="documents"
              onChange={handleFileUpload}
              multiple
              className="d-none"
            />
            <label htmlFor="documents" className="btn btn-outline-primary mb-2">
              <FontAwesomeIcon icon={faUpload} className="me-2" />
              Télécharger des documents
            </label>
            <div className="text-muted small">
              Certificats de scolarité, photos, rapports médicaux, etc.
            </div>
          </div>
          
          {/* Display previously uploaded documents if editing */}
          {formData.documents && formData.documents.length > 0 && (
            <div className="file-list">
              <h6>Documents existants:</h6>
              {formData.documents.map(doc => (
                <div key={doc.id} className="file-item">
                  <span className="file-name">{doc.name}</span>
                </div>
              ))}
            </div>
          )}
          
          {/* Display newly uploaded files */}
          {uploadedFiles.length > 0 && (
            <div className="file-list">
              <h6>Nouveaux documents:</h6>
              {uploadedFiles.map(file => (
                <div key={file.id} className="file-item">
                  <span className="file-name">{file.name}</span>
                  <button 
                    type="button" 
                    className="btn btn-sm btn-danger file-actions"
                    onClick={() => handleRemoveFile(file.id)}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-4 d-flex justify-content-end">
            <Link to="/students" className="btn btn-outline-secondary me-2">
              Annuler
            </Link>
            <button type="submit" className="btn btn-primary">
              <FontAwesomeIcon icon={faSave} className="me-2" />
              {id ? 'Mettre à jour' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentForm; 