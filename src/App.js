// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './styles/bootstrap.min.css'; // Import the downloaded Bootswatch theme
import Login from './components/Login';
import Monitor from './components/Monitor';
import Register from './components/Register';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import { AuthProvider, useAuth } from './AuthContext'; // Import AuthProvider

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();
  
  return isLoggedIn ? children : <Navigate to="/" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />  {/* Navigation bar on top */}
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/monitor" element={<ProtectedRoute><Monitor /></ProtectedRoute>} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
