import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, 
  faPlus, 
  faFilter, 
  faSave,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useStudents } from '../../context/StudentContext';

// Expense categories
const EXPENSE_CATEGORIES = [
  'Éducation',
  'Fourniture scolaire',
  'Santé',
  'Autres'
];

// Sub-categories mapping
const SUB_CATEGORIES = {
  'Éducation': ['Frais de scolarité', 'Uniformes', 'Transport', 'Activités extrascolaires'],
  'Fourniture scolaire': ['Livres', 'Cahiers', 'Stylos et crayons', 'Autre matériel'],
  'Santé': ['Consultations', 'Médicaments', 'Lunettes', 'Autres soins'],
  'Autres': ['Vêtements', 'Nourriture', 'Logement', 'Divers']
};

const StudentExpenses = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getStudent, getStudentExpenses, addExpense } = useStudents();
  
  // Student and expenses data
  const [student, setStudent] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form state for adding expense
  const [showAddForm, setShowAddForm] = useState(false);
  const [newExpense, setNewExpense] = useState({
    date: new Date(),
    amount: '',
    category: '',
    subcategory: '',
    description: ''
  });
  
  // Filtering and sorting
  const [dateFilter, setDateFilter] = useState({ from: null, to: null });
  const [categoryFilter, setCategoryFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  
  // Form validation
  const [errors, setErrors] = useState({});
  
  // Load student and expense data
  useEffect(() => {
    const studentData = getStudent(id);
    if (studentData) {
      setStudent(studentData);
      setExpenses(getStudentExpenses(parseInt(id)));
    } else {
      // Student not found, redirect to list
      navigate('/students');
    }
    setLoading(false);
  }, [id, getStudent, getStudentExpenses, navigate]);
  
  // Apply filters
  useEffect(() => {
    let filtered = [...expenses];
    
    // Apply date range filter
    if (dateFilter.from && dateFilter.to) {
      filtered = filtered.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= dateFilter.from && expenseDate <= dateFilter.to;
      });
    } else if (dateFilter.from) {
      filtered = filtered.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= dateFilter.from;
      });
    } else if (dateFilter.to) {
      filtered = filtered.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate <= dateFilter.to;
      });
    }
    
    // Apply category filter
    if (categoryFilter) {
      filtered = filtered.filter(expense => expense.category === categoryFilter);
    }
    
    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(expense => 
        expense.description.toLowerCase().includes(term) ||
        expense.subcategory.toLowerCase().includes(term)
      );
    }
    
    // Sort by date (most recent first)
    filtered = filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    setFilteredExpenses(filtered);
  }, [expenses, dateFilter, categoryFilter, searchTerm]);
  
  // Calculate totals by category
  const calculateCategoryTotals = () => {
    const totals = {};
    
    EXPENSE_CATEGORIES.forEach(category => {
      const categoryExpenses = filteredExpenses.filter(expense => expense.category === category);
      totals[category] = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    });
    
    return totals;
  };
  
  const categoryTotals = calculateCategoryTotals();
  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  // Handle expense form input changes
  const handleExpenseChange = (e) => {
    const { name, value } = e.target;
    
    // If category is changed, reset subcategory
    if (name === 'category') {
      setNewExpense(prev => ({
        ...prev,
        [name]: value,
        subcategory: ''
      }));
    } else {
      setNewExpense(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  // Handle date change
  const handleDateChange = (date) => {
    setNewExpense(prev => ({
      ...prev,
      date
    }));
    
    // Clear error for this field if it exists
    if (errors.date) {
      setErrors(prev => ({
        ...prev,
        date: null
      }));
    }
  };
  
  // Validate expense form
  const validateExpenseForm = () => {
    const newErrors = {};
    
    // Check required fields
    if (!newExpense.date) newErrors.date = "La date est requise";
    if (!newExpense.amount) newErrors.amount = "Le montant est requis";
    if (!newExpense.category) newErrors.category = "La catégorie est requise";
    if (!newExpense.description) newErrors.description = "La description est requise";
    
    // Check amount is a positive number
    if (newExpense.amount && (isNaN(newExpense.amount) || parseFloat(newExpense.amount) <= 0)) {
      newErrors.amount = "Le montant doit être un nombre positif";
    }
    
    // Check date is not in the future
    if (newExpense.date && new Date(newExpense.date) > new Date()) {
      newErrors.date = "La date ne peut pas être future";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle expense form submission
  const handleSubmitExpense = (e) => {
    e.preventDefault();
    
    if (!validateExpenseForm()) {
      return;
    }
    
    // Create expense object
    const expenseData = {
      studentId: parseInt(id),
      date: newExpense.date.toISOString().slice(0, 10),
      amount: parseFloat(newExpense.amount),
      category: newExpense.category,
      subcategory: newExpense.subcategory || 'Non spécifié',
      description: newExpense.description
    };
    
    // Add expense
    addExpense(expenseData);
    
    // Reset form and hide it
    setNewExpense({
      date: new Date(),
      amount: '',
      category: '',
      subcategory: '',
      description: ''
    });
    setShowAddForm(false);
    
    // Update expenses list
    setExpenses(getStudentExpenses(parseInt(id)));
  };
  
  // Reset filters
  const resetFilters = () => {
    setDateFilter({ from: null, to: null });
    setCategoryFilter('');
    setSearchTerm('');
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
        <h2>Dépenses - {student.firstName} {student.lastName}</h2>
        <div>
          <Link to={`/students/${id}`} className="btn btn-outline-secondary me-2">
            <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
            Retour au profil
          </Link>
          
          <button 
            className="btn btn-primary"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            <FontAwesomeIcon icon={showAddForm ? faTimes : faPlus} className="me-2" />
            {showAddForm ? 'Annuler' : 'Ajouter une dépense'}
          </button>
        </div>
      </div>
      
      {/* Add Expense Form */}
      {showAddForm && (
        <div className="card form-card mb-4 slide-in-left">
          <div className="card-body">
            <h4 className="form-title">Nouvelle dépense</h4>
            
            <form onSubmit={handleSubmitExpense}>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="date" className="form-label required-field">Date</label>
                  <DatePicker
                    selected={newExpense.date}
                    onChange={handleDateChange}
                    className={`form-control ${errors.date ? 'is-invalid' : ''}`}
                    dateFormat="dd/MM/yyyy"
                    maxDate={new Date()}
                    id="date"
                  />
                  {errors.date && (
                    <div className="invalid-feedback d-block">{errors.date}</div>
                  )}
                </div>
                
                <div className="col-md-6">
                  <label htmlFor="amount" className="form-label required-field">Montant (MAD)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className={`form-control ${errors.amount ? 'is-invalid' : ''}`}
                    id="amount"
                    name="amount"
                    value={newExpense.amount}
                    onChange={handleExpenseChange}
                  />
                  {errors.amount && (
                    <div className="invalid-feedback">{errors.amount}</div>
                  )}
                </div>
              </div>
              
              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="category" className="form-label required-field">Catégorie</label>
                  <select
                    className={`form-select ${errors.category ? 'is-invalid' : ''}`}
                    id="category"
                    name="category"
                    value={newExpense.category}
                    onChange={handleExpenseChange}
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {EXPENSE_CATEGORIES.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  {errors.category && (
                    <div className="invalid-feedback">{errors.category}</div>
                  )}
                </div>
                
                <div className="col-md-6">
                  <label htmlFor="subcategory" className="form-label">Sous-catégorie</label>
                  <select
                    className="form-select"
                    id="subcategory"
                    name="subcategory"
                    value={newExpense.subcategory}
                    onChange={handleExpenseChange}
                    disabled={!newExpense.category}
                  >
                    <option value="">Sélectionner une sous-catégorie</option>
                    {newExpense.category && SUB_CATEGORIES[newExpense.category].map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="mb-3">
                <label htmlFor="description" className="form-label required-field">Description</label>
                <textarea
                  className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                  id="description"
                  name="description"
                  rows="3"
                  value={newExpense.description}
                  onChange={handleExpenseChange}
                ></textarea>
                {errors.description && (
                  <div className="invalid-feedback">{errors.description}</div>
                )}
              </div>
              
              <div className="d-flex justify-content-end">
                <button type="button" className="btn btn-outline-secondary me-2" onClick={() => setShowAddForm(false)}>
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary">
                  <FontAwesomeIcon icon={faSave} className="me-2" />
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Filters */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="mb-3">
            <FontAwesomeIcon icon={faFilter} className="me-2" />
            Filtres
          </h5>
          
          <div className="row">
            <div className="col-md-3 mb-3">
              <label className="form-label">Période de début</label>
              <DatePicker
                selected={dateFilter.from}
                onChange={date => setDateFilter(prev => ({ ...prev, from: date }))}
                className="form-control"
                dateFormat="dd/MM/yyyy"
                isClearable
                placeholderText="Date de début"
              />
            </div>
            
            <div className="col-md-3 mb-3">
              <label className="form-label">Période de fin</label>
              <DatePicker
                selected={dateFilter.to}
                onChange={date => setDateFilter(prev => ({ ...prev, to: date }))}
                className="form-control"
                dateFormat="dd/MM/yyyy"
                isClearable
                placeholderText="Date de fin"
              />
            </div>
            
            <div className="col-md-3 mb-3">
              <label className="form-label">Catégorie</label>
              <select
                className="form-select"
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
              >
                <option value="">Toutes les catégories</option>
                {EXPENSE_CATEGORIES.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div className="col-md-3 mb-3">
              <label className="form-label">Recherche</label>
              <input
                type="text"
                className="form-control"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="d-flex justify-content-end">
            <button className="btn btn-outline-secondary" onClick={resetFilters}>
              Réinitialiser les filtres
            </button>
          </div>
        </div>
      </div>
      
      {/* Summary */}
      <div className="row mb-4">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h5 className="card-title mb-0">Résumé des dépenses</h5>
            </div>
            <div className="card-body">
              <div className="row">
                {EXPENSE_CATEGORIES.map(category => (
                  <div key={category} className="col-md-3 col-6 mb-3">
                    <div className={`card border-0 category-${category === 'Éducation' ? 'education' : category === 'Fourniture scolaire' ? 'supplies' : category === 'Santé' ? 'health' : 'other'}`}>
                      <div className="card-body py-2 px-3">
                        <h6 className="card-title">{category}</h6>
                        <h4 className="mb-0">{categoryTotals[category] || 0} <small>MAD</small></h4>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-header bg-success text-white">
              <h5 className="card-title mb-0">Total</h5>
            </div>
            <div className="card-body d-flex align-items-center justify-content-center">
              <div className="text-center">
                <h1 className="display-4 mb-0">{totalExpenses} <small>MAD</small></h1>
                <p className="text-muted mb-0">
                  {filteredExpenses.length} dépense{filteredExpenses.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Expense List */}
      <div className="card">
        <div className="card-header bg-light">
          <h5 className="card-title mb-0">Liste des dépenses</h5>
        </div>
        <div className="card-body p-0">
          {filteredExpenses.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover data-table mb-0">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Catégorie</th>
                    <th>Sous-catégorie</th>
                    <th>Description</th>
                    <th className="text-end">Montant (MAD)</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExpenses.map(expense => (
                    <tr key={expense.id}>
                      <td>{new Date(expense.date).toLocaleDateString()}</td>
                      <td>
                        <span className={`badge category-${expense.category === 'Éducation' ? 'education' : expense.category === 'Fourniture scolaire' ? 'supplies' : expense.category === 'Santé' ? 'health' : 'other'}`}>
                          {expense.category}
                        </span>
                      </td>
                      <td>{expense.subcategory}</td>
                      <td>{expense.description}</td>
                      <td className="text-end fw-bold">{expense.amount} MAD</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-4 text-center">
              <div className="alert alert-info mb-0">
                Aucune dépense ne correspond aux critères sélectionnés.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentExpenses; 