import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, BookOpen, DollarSign, User } from 'lucide-react';

export default function BottomNav() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bottom-nav">
      <Link to="/" className={`bottom-nav-item ${isActive('/') ? 'active' : ''}`}>
        <Home size={24} />
        <span className="text-xs mt-1">Início</span>
      </Link>
      <Link to="/classes" className={`bottom-nav-item ${isActive('/classes') ? 'active' : ''}`}>
        <Calendar size={24} />
        <span className="text-xs mt-1">Aulas</span>
      </Link>
      <Link to="/reservations" className={`bottom-nav-item ${isActive('/reservations') ? 'active' : ''}`}>
        <BookOpen size={24} />
        <span className="text-xs mt-1">Reservas</span>
      </Link>
      <Link to="/payments" className={`bottom-nav-item ${isActive('/payments') ? 'active' : ''}`}>
        <DollarSign size={24} />
        <span className="text-xs mt-1">Cobranças</span>
      </Link>
      <Link to="/profile" className={`bottom-nav-item ${isActive('/profile') ? 'active' : ''}`}>
        <User size={24} />
        <span className="text-xs mt-1">Perfil</span>
      </Link>
    </nav>
  );
}
