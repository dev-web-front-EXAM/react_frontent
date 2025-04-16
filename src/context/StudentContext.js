import React, { createContext, useContext, useState, useEffect } from 'react';

// Initial sample data
const initialStudents = [
    {
        id: 1,
        firstName: 'Karim',
        lastName: 'Benali',
        birthDate: '2010-05-15',
        school: 'École Al Fath',
        class: 'CE2',
        parentContact: {
            phone: '0661234567',
            email: 'parent1@example.com'
        },
        specialNeeds: 'Aucun',
        documents: [
            { id: 1, name: 'Certificat de scolarité', path: '/documents/cert1.pdf' }
        ],
        sponsor: 'Ahmed Tazi',
        isActive: true,
        createdAt: '2023-01-15'
    },
    {
        id: 2,
        firstName: 'Leila',
        lastName: 'Kadiri',
        birthDate: '2012-09-20',
        school: 'École Ibn Sina',
        class: 'CP',
        parentContact: {
            phone: '0667891234',
            email: 'parent2@example.com'
        },
        specialNeeds: 'Lunettes obligatoires',
        documents: [
            { id: 2, name: 'Certificat de scolarité', path: '/documents/cert2.pdf' },
            { id: 3, name: 'Rapport médical', path: '/documents/medical2.pdf' }
        ],
        sponsor: null,
        isActive: true,
        createdAt: '2023-02-10'
    },
    {
        id: 3,
        firstName: 'Younes',
        lastName: 'Alami',
        birthDate: '2009-12-03',
        school: 'École Al Fath',
        class: 'CM1',
        parentContact: {
            phone: '0673456789',
            email: 'parent3@example.com'
        },
        specialNeeds: 'Aucun',
        documents: [
            { id: 4, name: 'Certificat de scolarité', path: '/documents/cert3.pdf' }
        ],
        sponsor: 'Nadia Idrissi',
        isActive: true,
        createdAt: '2022-09-05'
    }
];

// Initial sample expense data
const initialExpenses = [
    {
        id: 1,
        studentId: 1,
        date: '2023-04-10',
        amount: 350,
        category: 'Éducation',
        subcategory: 'Frais de scolarité',
        description: 'Paiement trimestriel des frais',
        createdBy: 'admin'
    },
    {
        id: 2,
        studentId: 1,
        date: '2023-03-15',
        amount: 150,
        category: 'Fourniture scolaire',
        subcategory: 'Livres',
        description: 'Achat de manuels',
        createdBy: 'admin'
    },
    {
        id: 3,
        studentId: 2,
        date: '2023-04-05',
        amount: 200,
        category: 'Santé',
        subcategory: 'Consultations',
        description: 'Consultation ophtalmologique',
        createdBy: 'admin'
    },
    {
        id: 4,
        studentId: 2,
        date: '2023-03-20',
        amount: 300,
        category: 'Éducation',
        subcategory: 'Frais de scolarité',
        description: 'Paiement trimestriel des frais',
        createdBy: 'admin'
    }
];

// Create context
const StudentContext = createContext();

// Context Provider
export const StudentProvider = ({ children }) => {
    const [students, setStudents] = useState(() => {
        const savedStudents = localStorage.getItem('students');
        return savedStudents ? JSON.parse(savedStudents) : initialStudents;
    });

    const [expenses, setExpenses] = useState(() => {
        const savedExpenses = localStorage.getItem('expenses');
        return savedExpenses ? JSON.parse(savedExpenses) : initialExpenses;
    });

    // Save to localStorage whenever data changes
    useEffect(() => {
        localStorage.setItem('students', JSON.stringify(students));
    }, [students]);

    useEffect(() => {
        localStorage.setItem('expenses', JSON.stringify(expenses));
    }, [expenses]);

    // Add a new student
    const addStudent = (student) => {
        const newStudent = {
            ...student,
            id: students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1,
            isActive: true,
            createdAt: new Date().toISOString().slice(0, 10)
        };
        setStudents([...students, newStudent]);
        return newStudent;
    };

    // Update a student
    const updateStudent = (id, updatedData) => {
        const updatedStudents = students.map(student =>
            student.id === id ? { ...student, ...updatedData } : student
        );
        setStudents(updatedStudents);
    };

    // Delete a student (logical delete)
    const deleteStudent = (id) => {
        const updatedStudents = students.map(student =>
            student.id === id ? { ...student, isActive: false } : student
        );
        setStudents(updatedStudents);
    };

    // Restore a deleted student
    const restoreStudent = (id) => {
        const updatedStudents = students.map(student =>
            student.id === id ? { ...student, isActive: true } : student
        );
        setStudents(updatedStudents);
    };

    // Get a student by ID
    const getStudent = (id) => {
        return students.find(student => student.id === parseInt(id));
    };

    // Add an expense
    const addExpense = (expense) => {
        const newExpense = {
            ...expense,
            id: expenses.length > 0 ? Math.max(...expenses.map(e => e.id)) + 1 : 1,
            createdBy: 'admin' // In a real app, this would be the current user
        };
        setExpenses([...expenses, newExpense]);
        return newExpense;
    };

    // Get expenses for a student
    const getStudentExpenses = (studentId) => {
        return expenses.filter(expense => expense.studentId === parseInt(studentId));
    };

    return (
        <StudentContext.Provider
            value={{
                students,
                expenses,
                addStudent,
                updateStudent,
                deleteStudent,
                restoreStudent,
                getStudent,
                addExpense,
                getStudentExpenses
            }}
        >
            {children}
        </StudentContext.Provider>
    );
};

// Custom hook for using the student context
export const useStudents = () => {
    const context = useContext(StudentContext);
    if (!context) {
        throw new Error("useStudents must be used within a StudentProvider");
    }
    return context;
};

export default StudentContext; 