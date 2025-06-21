import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Dashboard from './pages/Dashboard';
import Secretarias from './pages/Secretarias';
import Projetos from './pages/Projetos';
import { Loader2 } from 'lucide-react';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const AppContent = () => {
  const { isAuthenticated, loading } = useAuth();
  const [secretarias, setSecretarias] = useState([]);
  const [projetos, setProjetos] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      const token = localStorage.getItem("token");

      if (token) {
        fetch('https://site-qwau.onrender.com/api/secretarias', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })
        .then((response) => response.json())
        .then((data) => setSecretarias(data.secretarias))
        .catch((error) => console.error('Erro ao carregar secretarias:', error));

        fetch('https://site-qwau.onrender.com/api/projetos', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })
        .then((response) => response.json())
        .then((data) => setProjetos(data.projetos))
        .catch((error) => console.error('Erro ao carregar projetos:', error));
      }
    }
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/" element={<ProtectedRoute><Dashboard secretarias={secretarias} projetos={projetos} /></ProtectedRoute>} />
      <Route path="/secretarias" element={<ProtectedRoute><Secretarias secretarias={secretarias} /></ProtectedRoute>} />
      <Route path="/projetos" element={<ProtectedRoute><Projetos projetos={projetos} /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
