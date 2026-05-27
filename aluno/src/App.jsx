import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import BottomNav from './components/BottomNav';
import Login from './pages/Login';
import Home from './pages/Home';
import Classes from './pages/Classes';
import Reservations from './pages/Reservations';
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
              <div className="pb-20">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/classes" element={<Classes />} />
                  <Route path="/reservations" element={<Reservations />} />
                  <Route path="/payments" element={<Payments />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </div>
              <BottomNav />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
