import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Boxes from './pages/Boxes';
import BoxDetail from './pages/BoxDetail';
import Students from './pages/Students';
import Classes from './pages/Classes';
import Payments from './pages/Payments';
import Profile from './pages/Profile';

function ProtectedRoute({ children }) {
  const { token } = useAuthStore();
  return token ? children : <Navigate to="/login" />;
}

export default function App() {
  const { token, loadFromStorage } = useAuthStore();

  useEffect(() => {
    loadFromStorage();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/boxes" element={<Boxes />} />
                  <Route path="/boxes/:boxId" element={<BoxDetail />} />
                  
                  {/* Rotas limpas e globais para o menu lateral encontrar! */}
                  <Route path="/classes" element={<Classes />} />
                  <Route path="/students" element={<Students />} />
                  <Route path="/payments" element={<Payments />} />
                  <Route path="/profile" element={<Profile />} />
                  
                  {/* Qualquer link errado volta pro começo */}
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
