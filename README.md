# Student Management System

A comprehensive web application built with React for managing student information and their associated expenses. This project integrates Firebase for authentication and database functionality, providing a secure and efficient way to track student data.

## Features

- **User Authentication**: Secure login and registration system using Firebase Authentication
- **Dashboard**: Overview of student statistics and recent activities
- **Student Management**:
  - Add, edit, and view detailed student information
  - Track student expenses with categorization
  - Filter and search functionality for easy data access
- **Responsive Design**: Built with Bootstrap for a seamless experience across devices

## Technology Stack

- **Frontend**: React js
- **Routing**: React Router
- **UI Framework**: Bootstrap 5 and React Bootstrap 2.10
- **Icons**: Font Awesome
- **Backend & Database**: Firebase
- **Date Management**: React-DatePicker
- **Authentication**: Firebase Authentication

## Project Structure

```
├── public/             # Static files
├── src/                # Source code
│   ├── components/     # React components
│   │   ├── auth/       # Authentication components (Login, Register)
│   │   ├── layout/     # Layout components
│   │   └── students/   # Student management components
│   ├── context/        # React context for state management
│   ├── firebase/       # Firebase configuration and services
│   ├── App.js          # Main application component
│   └── index.js        # Application entry point
└── package.json        # Project dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js (version 14.x or higher recommended)
- npm or yarn

### Installation

1. Clone the repository
   ```
   git clone <repository-url>
   cd react_frontend
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Start the development server
   ```
   npm start
   ```
   The application will open in your browser at `http://localhost:3000`

## Usage

1. **Registration/Login**: Create a new account or sign in with existing credentials
2. **Dashboard**: View summary statistics of student data
3. **Student Management**:
   - Browse the student list
   - Add new students with the student form
   - View detailed information about each student
   - Track and manage student expenses

## Firebase Configuration

The application uses Firebase for authentication and database services. You need to set up a Firebase project and update the configuration in `src/firebase/firebase.js`.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [React](https://reactjs.org/)
- [Firebase](https://firebase.google.com/)
- [Bootstrap](https://getbootstrap.com/)
- [Font Awesome](https://fontawesome.com/)
